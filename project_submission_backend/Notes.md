# Frontend form field specs — Warehouse, Warehouse Location, Product

Three separate forms, matching the three create endpoints in the service code. Fields pulled directly from the Prisma schema + what `createNewWarehouseInDB` / `createWarehouseLocationInDB` / `createProductIntoDB` actually consume. System fields (`id`, `createdAt`, `updatedAt`) and computed fields (`avgRating`, `totalReviews`) are excluded — they're never user-entered.

---

## 1. Warehouse form

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `managerId` | ObjectId | Yes | Select (Admin, filtered to `adminRole = Warehouse_Manager`) | Backend rejects any other admin role with 404 |
| `warehouseName` | string | Yes | Text | Display name |
| `warehouseId` | string | Yes | Text | Human-readable warehouse code (separate from Mongo `_id`) |
| `type` | string | Yes | Text or select | Free text in schema — pick a fixed list if you want consistency (e.g. "Distribution", "Cold storage") |
| `storageType` | string | Yes | Text or select | Same — no enum enforced server-side |
| `address` | string | Yes | Text | |
| `city` | string | Yes | Text | |
| `country` | string | Yes | Text or country select | |
| `postCode` | string | Yes | Text | |
| `contactNumber` | string | Yes | Tel | |
| `openingTime` | string | Yes | Time picker | Stored as string, not `DateTime` |
| `closingTime` | string | Yes | Time picker | Stored as string |
| `operatingDays` | string[] | Yes | Multi-select checkboxes (Mon–Sun) | |

**Capacity section — repeatable array, at least one row recommended:**

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `totalZones` | int | Yes | Number | |
| `totalCapacity` | int | Yes | Number | Raw unit count — see the unit-type note below |
| `unitType` | enum | Yes | Select (currently only `Unit`) | `TUnitType` has a single member today — this field can be a fixed/disabled dropdown for now |

---

## 2. Warehouse location form

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `warehouseId` | ObjectId | Yes | Select (Warehouse) | Locks the scope for the rest of the form |
| `name` | string | Yes | Text | Display name, e.g. "Zone A" |
| `code` | string | Yes | Text | Must be unique **within the selected warehouse** — validate/show error on duplicate |
| `type` | enum | Yes | Select | `ZONE`, `RACK`, `SHELF`, `BIN`, `PALLET_POSITION`, `BULK` |
| `parentId` | ObjectId | No | Select (existing locations, filtered to same `warehouseId`) | Backend rejects a parent from a different warehouse |
| `capacity` | int | No | Number | Optional per-location capacity limit |
| `capacityUnit` | enum | No | Select (currently only `Unit`) | Same one-member enum caveat as above |
| `status` | enum | No (defaults `ACTIVE`) | Select | `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `FULL` |

**UX tip:** since `parentId` must belong to the same warehouse, populate that dropdown dynamically after `warehouseId` is chosen, and re-filter if the user changes the warehouse.

---

## 3. Product form

### Basic info

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `name` | string | Yes | Text | |
| `shortDescription` | string | No | Text | |
| `categoryId` | ObjectId | Yes | Select (Category) | |
| `subcategoryId` | ObjectId | Yes | Select (SubCategory) | Must belong to chosen `categoryId` — backend checks this pair |
| `sku` | string | Yes | Text | Must be globally unique |
| `manufacturer` | string | No | Text | |
| `countryOfOrigin` | string | No | Text or country select | |

### Specifications

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `netWeight` | string | No | Text | Free text, e.g. "500g" — not used in any calculation |
| `baseUnit` | enum | No (defaults `Unit`) | Select (currently only `Unit`) | Placeholder field, see unit-type caveat |
| `packagingType` | string | No | Text | Cosmetic only |
| `containerType` | string | No | Text | Cosmetic only |
| `shelfLifeFrozen` | string | No | Text | |
| `storageTemperature` | string | No | Text | |
| `defrostMethod` | string | No | Text | |
| `halalCertified` | boolean | No (defaults `false`) | Checkbox | |

### Media

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `images` | file[] | **Yes, at least 1** | File upload (multipart) | Backend throws 400 if none uploaded |
| `certificates` | file[] | No | File upload (multipart) | |

### Extra content

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `detailsDescription` | string | No | Rich text / textarea | |
| `cookingInstructions` | string | No | Rich text / textarea | |

### Settings & visibility

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `status` | enum | No (defaults `INACTIVE`) | Select | `ACTIVE`, `INACTIVE` |
| `isSeasonal` | boolean | No (defaults `false`) | Checkbox | |
| `isFeatured` | boolean | No (defaults `false`) | Checkbox | |
| `allowB2C` | boolean | No (defaults `true`) | Checkbox | |
| `allowB2B` | boolean | No (defaults `true`) | Checkbox | |
| `retailPrice` | float | No | Number | B2C price; separate from tiered B2B pricing below |

### Pricing tiers — repeatable, **at least one row required**

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `tierName` | string | Yes | Text | e.g. "Tier 1" |
| `minQty` | int | Yes | Number | |
| `maxQty` | int | No | Number | Open-ended if blank |
| `pricePerUnit` | float | Yes | Number | |
| `status` | enum | No (defaults `ACTIVE`) | Select | `ACTIVE`, `INACTIVE` |

### Storage locations — repeatable, **at least one row required**

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `warehouseId` / `warehouse` | string | Yes | Select (Warehouse) — accepts ObjectId, warehouse code, or warehouse name | Backend tries all three lookups |
| `locationId` | ObjectId | No | Select (WarehouseLocation, filtered to chosen warehouse) | |
| `locationCode` | string | No | Text (fallback if `locationId` not picked) | Used to look up the location if ID isn't given |
| `binShelf` | string | No | Text | Free-text sub-label |
| `quantity` | int | Yes | Number | Checked against both warehouse-level and location-level capacity |
| `batches` | array | No | Repeatable sub-rows | |
| &nbsp;&nbsp;`batchLotNumber` | string | No | Text | |
| &nbsp;&nbsp;`expiryDate` | date | No | Date picker | |
| &nbsp;&nbsp;`manufacturingDate` | date | No | Date picker | |

### Inventory overrides — optional / "advanced" section

The backend auto-calculates these from the storage-location quantities if omitted, so this section can be collapsed/hidden by default:

| Field | Type | Required | Input | Notes |
|---|---|---|---|---|
| `totalStockQty` | int | No | Number | Defaults to sum of storage-location quantities |
| `reservedQty` | int | No | Number | Defaults to `0` |
| `availableQty` | int | No | Number | Defaults to `totalStockQty - reservedQty` |
| `minStockLevel` | int | No | Number | Defaults to `0`; drives `stockStatus` (in/low/out of stock) |

---

## Cross-form dependencies to wire up in the UI

- **Warehouse Location form**: `warehouseId` must be picked before `parentId` options load (parent list = locations in that warehouse only).
- **Product form**: `subcategoryId` options load after `categoryId` is picked. Each row in "Storage locations" should let the user pick a warehouse, then dynamically load that warehouse's locations for `locationId`/`locationCode`. Consider a live capacity indicator (used vs. total) per warehouse/location as the user adds quantities, since the backend will reject over-capacity submissions only at save time.