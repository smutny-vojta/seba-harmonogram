/**
 * Soubor: src/features/harmonogram/dal.ts
 * Ucel: Data access layer pro feature "harmonogram".
 * Parametry/Vstupy: Prijima jiz validovana data a provadi CRUD operace nad DB.
 * Pozadavky: Resi pouze praci s daty a mapovani ID; neprovadi business validaci vstupu.
 */

import { type Collection, ObjectId } from "mongodb";
import { CAMP_CATEGORIES } from "@/lib/camp-categories";
import { db } from "@/lib/db";
import {
  assertCanManageTermHarmonogram,
  assertCanReadTermHarmonogram,
} from "@/lib/harmonogram-access";
import type {
  HarmonogramAudienceType,
  HarmonogramItemType,
  HarmonogramType,
  NewHarmonogramType,
} from "./types";

type GroupDocument = {
  _id: ObjectId;
  termKey: string;
  campCategory: keyof typeof CAMP_CATEGORIES;
};

const HarmonogramCollection: Collection<HarmonogramType> =
  db.collection("harmonogram");

const GroupCollection: Collection<GroupDocument> = db.collection("groups");

function toObjectId(value: string, label: string): ObjectId {
  if (!ObjectId.isValid(value)) {
    throw new Error(`${label} je neplatné.`);
  }

  return new ObjectId(value);
}

function mapHarmonogramToItem(entry: HarmonogramType): HarmonogramItemType {
  const { _id, groupIds, location, templateId, createdBy, ...rest } = entry;

  return {
    ...rest,
    id: _id.toString(),
    groupIds: groupIds.map((groupId) => groupId.toString()),
    locationId: location.toString(),
    templateId: templateId?.toString(),
    createdBy: createdBy?.toString(),
  };
}

async function assertValidGroupSelection({
  termKey,
  groupIds,
  audience,
}: {
  termKey: string;
  groupIds: string[];
  audience: HarmonogramAudienceType;
}): Promise<ObjectId[]> {
  const objectIds = groupIds.map((groupId) => toObjectId(groupId, "ID oddílu"));

  const groups = await GroupCollection.find({
    _id: { $in: objectIds },
  }).toArray();

  if (groups.length !== objectIds.length) {
    throw new Error("Některý z vybraných oddílů neexistuje.");
  }

  for (const group of groups) {
    if (group.termKey !== termKey) {
      throw new Error("Všechny oddíly musí patřit do stejného turnusu.");
    }

    const groupKind = CAMP_CATEGORIES[group.campCategory].kind;

    if (audience === "camp" && groupKind !== "camp") {
      throw new Error("Táborový harmonogram nesmí obsahovat oddíl Kancl.");
    }

    if (audience === "office" && groupKind !== "office") {
      throw new Error("Kancl harmonogram smí obsahovat pouze oddíl Kancl.");
    }
  }

  return objectIds;
}

export async function listHarmonogramByTerm({
  userId,
  termKey,
  audience,
}: {
  userId: string;
  termKey: string;
  audience: HarmonogramAudienceType;
}): Promise<HarmonogramItemType[]> {
  await assertCanReadTermHarmonogram({
    userId,
    termKey,
    audience,
  });

  const entries = await HarmonogramCollection.find({
    termKey,
    audience,
  })
    .sort({ day: 1, startTime: 1, title: 1 })
    .toArray();

  return entries.map(mapHarmonogramToItem);
}

export async function getHarmonogramById({
  userId,
  id,
}: {
  userId: string;
  id: string;
}): Promise<HarmonogramItemType | null> {
  const entry = await HarmonogramCollection.findOne({
    _id: toObjectId(id, "ID harmonogramu"),
  });

  if (!entry) {
    return null;
  }

  await assertCanReadTermHarmonogram({
    userId,
    termKey: entry.termKey,
    audience: entry.audience,
  });

  return mapHarmonogramToItem(entry);
}

export async function createHarmonogram({
  userId,
  data,
}: {
  userId: string;
  data: NewHarmonogramType;
}) {
  await assertCanManageTermHarmonogram({
    userId,
    termKey: data.termKey,
  });

  const groupIds = await assertValidGroupSelection({
    termKey: data.termKey,
    groupIds: data.groupIds,
    audience: data.audience,
  });

  const now = new Date();

  const createdBy = ObjectId.isValid(userId) ? new ObjectId(userId) : undefined;

  return HarmonogramCollection.insertOne({
    _id: new ObjectId(),
    termKey: data.termKey,
    groupIds,
    audience: data.audience,
    templateId: data.templateId
      ? toObjectId(data.templateId, "ID šablony")
      : undefined,
    day: data.day,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    title: data.title,
    description: data.description,
    location: toObjectId(data.locationId, "ID lokace"),
    category: data.category,
    materials: data.materials,
    createdBy,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateHarmonogram({
  userId,
  id,
  data,
}: {
  userId: string;
  id: string;
  data: NewHarmonogramType;
}) {
  const entryId = toObjectId(id, "ID harmonogramu");

  const existing = await HarmonogramCollection.findOne({
    _id: entryId,
  });

  if (!existing) {
    throw new Error("Položka harmonogramu nebyla nalezena.");
  }

  if (existing.termKey !== data.termKey) {
    throw new Error("Položku harmonogramu nelze přesouvat mezi turnusy.");
  }

  await assertCanManageTermHarmonogram({
    userId,
    termKey: existing.termKey,
  });

  const groupIds = await assertValidGroupSelection({
    termKey: data.termKey,
    groupIds: data.groupIds,
    audience: data.audience,
  });

  return HarmonogramCollection.updateOne(
    {
      _id: entryId,
    },
    {
      $set: {
        groupIds,
        audience: data.audience,
        templateId: data.templateId
          ? toObjectId(data.templateId, "ID šablony")
          : undefined,
        day: data.day,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        title: data.title,
        description: data.description,
        location: toObjectId(data.locationId, "ID lokace"),
        category: data.category,
        materials: data.materials,
        updatedAt: new Date(),
      },
    },
  );
}

export async function deleteHarmonogram({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const entryId = toObjectId(id, "ID harmonogramu");

  const existing = await HarmonogramCollection.findOne({
    _id: entryId,
  });

  if (!existing) {
    return 0;
  }

  await assertCanManageTermHarmonogram({
    userId,
    termKey: existing.termKey,
  });

  const result = await HarmonogramCollection.deleteOne({
    _id: entryId,
  });

  return result.deletedCount;
}
