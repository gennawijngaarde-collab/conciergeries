-- Seasonal rental PMS SaaS — initial migration
-- Matches prisma/schema.prisma (conceptual / runnable skeleton)

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE "RoleCode" AS ENUM ('SUPER_ADMIN', 'ENTERPRISE', 'MANAGER', 'RECEPTION', 'CLEANING', 'MAINTENANCE', 'OWNER');
CREATE TYPE "MemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'REMOVED');
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'DOCUMENT', 'OTHER');
CREATE TYPE "BookingStatus" AS ENUM ('INQUIRY', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW', 'BLOCKED');
CREATE TYPE "BookingChannel" AS ENUM ('AIRBNB', 'BOOKING', 'VRBO', 'EXPEDIA', 'GOOGLE', 'ABRITEL', 'DIRECT', 'OTHER');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED', 'CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER', 'CASH', 'STRIPE', 'PAYPAL', 'OTHER');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'VOID');
CREATE TYPE "CreditNoteStatus" AS ENUM ('DRAFT', 'ISSUED', 'APPLIED', 'VOID');
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'ACTIVE', 'EXPIRED', 'TERMINATED');
CREATE TYPE "CleaningTaskStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED', 'FAILED', 'CANCELLED');
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "MaintenanceStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS', 'RESOLVED', 'CLOSED', 'CANCELLED');
CREATE TYPE "CheckInStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED');
CREATE TYPE "CheckOutStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'LATE', 'CANCELLED');
CREATE TYPE "InventoryLogType" AS ENUM ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'TRANSFER', 'DAMAGE', 'LOSS');
CREATE TYPE "MessageChannel" AS ENUM ('AIRBNB', 'BOOKING', 'EMAIL', 'WHATSAPP', 'SMS', 'INTERNAL');
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND', 'SYSTEM');
CREATE TYPE "ThreadStatus" AS ENUM ('OPEN', 'PENDING', 'RESOLVED', 'ARCHIVED', 'SPAM');
CREATE TYPE "PricingRuleType" AS ENUM ('NIGHTLY', 'WEEKEND', 'SEASON', 'EVENT', 'MIN', 'MAX', 'MIN_STAY', 'MAX_STAY', 'DISCOUNT', 'PROMOTION');
CREATE TYPE "AutomationTrigger" AS ENUM ('BOOKING_CREATED', 'BOOKING_UPDATED', 'BOOKING_CANCELLED', 'CHECKIN_DUE', 'CHECKOUT_DUE', 'CLEANING_COMPLETED', 'MAINTENANCE_CREATED', 'PAYMENT_RECEIVED', 'MESSAGE_RECEIVED', 'SCHEDULE', 'WEBHOOK', 'MANUAL');
CREATE TYPE "AutomationRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED', 'CANCELLED');
CREATE TYPE "ChannelProvider" AS ENUM ('AIRBNB', 'BOOKING', 'VRBO', 'EXPEDIA', 'GOOGLE', 'ABRITEL', 'ICAL', 'OTHER');
CREATE TYPE "ChannelConnectionStatus" AS ENUM ('PENDING', 'CONNECTED', 'ERROR', 'DISCONNECTED', 'REVOKED');
CREATE TYPE "WebhookEventStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');
CREATE TYPE "AiJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');
CREATE TYPE "AiJobType" AS ENUM ('PRICING_SUGGESTION', 'MESSAGE_REPLY', 'LISTING_OPTIMIZATION', 'REVIEW_SUMMARY', 'DEMAND_FORECAST', 'OTHER');
CREATE TYPE "CalendarBlockReason" AS ENUM ('OWNER_STAY', 'MAINTENANCE', 'PREPARATION', 'SEASONAL_CLOSE', 'MANUAL', 'EXTERNAL', 'OTHER');

-- ─── Auth & RBAC ─────────────────────────────────────────────────────────────

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'fr',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_supabaseUserId_key" ON "User"("supabaseUserId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_supabaseUserId_idx" ON "User"("supabaseUserId");

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "legalName" TEXT,
    "siret" TEXT,
    "vatNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "locale" TEXT NOT NULL DEFAULT 'fr',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");
CREATE INDEX "Organization_isActive_idx" ON "Organization"("isActive");

CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "code" "RoleCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");
CREATE INDEX "Permission_resource_action_idx" ON "Permission"("resource", "action");

CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");
CREATE INDEX "OrganizationMember_roleId_idx" ON "OrganizationMember"("roleId");
CREATE INDEX "OrganizationMember_status_idx" ON "OrganizationMember"("status");

-- ─── CRM ─────────────────────────────────────────────────────────────────────

CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "nationality" TEXT,
    "language" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "idDocumentType" TEXT,
    "idDocumentNumber" TEXT,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalIds" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Guest_organizationId_idx" ON "Guest"("organizationId");
CREATE INDEX "Guest_email_idx" ON "Guest"("email");
CREATE INDEX "Guest_phone_idx" ON "Guest"("phone");
CREATE INDEX "Guest_organizationId_email_idx" ON "Guest"("organizationId", "email");

CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "bankIban" TEXT,
    "taxId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Owner_organizationId_idx" ON "Owner"("organizationId");
CREATE INDEX "Owner_userId_idx" ON "Owner"("userId");
CREATE INDEX "Owner_email_idx" ON "Owner"("email");

CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "contactName" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Vendor_organizationId_idx" ON "Vendor"("organizationId");
CREATE INDEX "Vendor_type_idx" ON "Vendor"("type");
CREATE INDEX "Vendor_isActive_idx" ON "Vendor"("isActive");

-- ─── Property ────────────────────────────────────────────────────────────────

CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "propertyType" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" DECIMAL(3,1) NOT NULL DEFAULT 1,
    "beds" INTEGER,
    "basePrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "touristTax" DECIMAL(12,2),
    "touristTaxType" TEXT,
    "deposit" DECIMAL(12,2),
    "cleaningFee" DECIMAL(12,2),
    "checkInTime" TEXT NOT NULL DEFAULT '16:00',
    "checkOutTime" TEXT NOT NULL DEFAULT '11:00',
    "houseRules" TEXT,
    "digitalGuide" JSONB,
    "amenitiesNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Property_organizationId_slug_key" ON "Property"("organizationId", "slug");
CREATE INDEX "Property_organizationId_idx" ON "Property"("organizationId");
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE INDEX "Property_isActive_idx" ON "Property"("isActive");
CREATE INDEX "Property_externalId_idx" ON "Property"("externalId");
CREATE INDEX "Property_latitude_longitude_idx" ON "Property"("latitude", "longitude");

CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER,
    "height" INTEGER,
    "durationSec" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PropertyMedia_propertyId_idx" ON "PropertyMedia"("propertyId");
CREATE INDEX "PropertyMedia_propertyId_sortOrder_idx" ON "PropertyMedia"("propertyId", "sortOrder");
CREATE INDEX "PropertyMedia_type_idx" ON "PropertyMedia"("type");

CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "icon" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Amenity_organizationId_code_key" ON "Amenity"("organizationId", "code");
CREATE INDEX "Amenity_organizationId_idx" ON "Amenity"("organizationId");
CREATE INDEX "Amenity_code_idx" ON "Amenity"("code");

CREATE TABLE "PropertyAmenity" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PropertyAmenity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PropertyAmenity_propertyId_amenityId_key" ON "PropertyAmenity"("propertyId", "amenityId");
CREATE INDEX "PropertyAmenity_propertyId_idx" ON "PropertyAmenity"("propertyId");
CREATE INDEX "PropertyAmenity_amenityId_idx" ON "PropertyAmenity"("amenityId");

-- ─── Reservations & Calendar ─────────────────────────────────────────────────

CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "guestId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "channel" "BookingChannel" NOT NULL DEFAULT 'DIRECT',
    "confirmationCode" TEXT,
    "externalId" TEXT,
    "externalIds" JSONB,
    "checkInDate" DATE NOT NULL,
    "checkOutDate" DATE NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "pets" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "nightlyRate" DECIMAL(12,2),
    "nightsCount" INTEGER,
    "subtotal" DECIMAL(12,2),
    "cleaningFee" DECIMAL(12,2),
    "touristTax" DECIMAL(12,2),
    "serviceFee" DECIMAL(12,2),
    "discount" DECIMAL(12,2),
    "totalAmount" DECIMAL(12,2),
    "paidAmount" DECIMAL(12,2),
    "depositAmount" DECIMAL(12,2),
    "notes" TEXT,
    "guestNotes" TEXT,
    "source" TEXT,
    "bookedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Reservation_organizationId_idx" ON "Reservation"("organizationId");
CREATE INDEX "Reservation_propertyId_idx" ON "Reservation"("propertyId");
CREATE INDEX "Reservation_guestId_idx" ON "Reservation"("guestId");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX "Reservation_channel_idx" ON "Reservation"("channel");
CREATE INDEX "Reservation_externalId_idx" ON "Reservation"("externalId");
CREATE INDEX "Reservation_checkInDate_checkOutDate_idx" ON "Reservation"("checkInDate", "checkOutDate");
CREATE INDEX "Reservation_propertyId_checkInDate_checkOutDate_idx" ON "Reservation"("propertyId", "checkInDate", "checkOutDate");
CREATE INDEX "Reservation_organizationId_status_idx" ON "Reservation"("organizationId", "status");
CREATE INDEX "Reservation_confirmationCode_idx" ON "Reservation"("confirmationCode");

CREATE TABLE "CalendarBlock" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" "CalendarBlockReason" NOT NULL DEFAULT 'MANUAL',
    "notes" TEXT,
    "externalId" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CalendarBlock_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CalendarBlock_organizationId_idx" ON "CalendarBlock"("organizationId");
CREATE INDEX "CalendarBlock_propertyId_idx" ON "CalendarBlock"("propertyId");
CREATE INDEX "CalendarBlock_startDate_endDate_idx" ON "CalendarBlock"("startDate", "endDate");
CREATE INDEX "CalendarBlock_propertyId_startDate_endDate_idx" ON "CalendarBlock"("propertyId", "startDate", "endDate");
CREATE INDEX "CalendarBlock_externalId_idx" ON "CalendarBlock"("externalId");

-- ─── Finance ─────────────────────────────────────────────────────────────────

CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestId" TEXT,
    "propertyId" TEXT,
    "vendorId" TEXT,
    "number" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "issueDate" DATE NOT NULL,
    "dueDate" DATE,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invoice_organizationId_number_key" ON "Invoice"("organizationId", "number");
CREATE INDEX "Invoice_organizationId_idx" ON "Invoice"("organizationId");
CREATE INDEX "Invoice_reservationId_idx" ON "Invoice"("reservationId");
CREATE INDEX "Invoice_guestId_idx" ON "Invoice"("guestId");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_issueDate_idx" ON "Invoice"("issueDate");

CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "InvoiceLine_invoiceId_idx" ON "InvoiceLine"("invoiceId");

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestId" TEXT,
    "ownerId" TEXT,
    "invoiceId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "stripePaymentId" TEXT,
    "externalId" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(12,2),
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Payment_organizationId_idx" ON "Payment"("organizationId");
CREATE INDEX "Payment_reservationId_idx" ON "Payment"("reservationId");
CREATE INDEX "Payment_guestId_idx" ON "Payment"("guestId");
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_externalId_idx" ON "Payment"("externalId");
CREATE INDEX "Payment_stripePaymentId_idx" ON "Payment"("stripePaymentId");

CREATE TABLE "CreditNote" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "number" TEXT NOT NULL,
    "status" "CreditNoteStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "amount" DECIMAL(12,2) NOT NULL,
    "reason" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CreditNote_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CreditNote_organizationId_number_key" ON "CreditNote"("organizationId", "number");
CREATE INDEX "CreditNote_organizationId_idx" ON "CreditNote"("organizationId");
CREATE INDEX "CreditNote_invoiceId_idx" ON "CreditNote"("invoiceId");
CREATE INDEX "CreditNote_status_idx" ON "CreditNote"("status");

CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT,
    "reservationId" TEXT,
    "guestId" TEXT,
    "ownerId" TEXT,
    "title" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "type" TEXT,
    "content" TEXT,
    "documentUrl" TEXT,
    "signedAt" TIMESTAMP(3),
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Contract_organizationId_idx" ON "Contract"("organizationId");
CREATE INDEX "Contract_propertyId_idx" ON "Contract"("propertyId");
CREATE INDEX "Contract_reservationId_idx" ON "Contract"("reservationId");
CREATE INDEX "Contract_status_idx" ON "Contract"("status");
CREATE INDEX "Contract_externalId_idx" ON "Contract"("externalId");

-- ─── Staff & Cleaning ────────────────────────────────────────────────────────

CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "department" TEXT,
    "hireDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");
CREATE INDEX "Employee_organizationId_idx" ON "Employee"("organizationId");
CREATE INDEX "Employee_isActive_idx" ON "Employee"("isActive");

CREATE TABLE "CleaningTeam" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vendorId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CleaningTeam_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CleaningTeam_organizationId_idx" ON "CleaningTeam"("organizationId");
CREATE INDEX "CleaningTeam_vendorId_idx" ON "CleaningTeam"("vendorId");

CREATE TABLE "CleaningTeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "isLead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CleaningTeamMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CleaningTeamMember_teamId_employeeId_key" ON "CleaningTeamMember"("teamId", "employeeId");
CREATE INDEX "CleaningTeamMember_teamId_idx" ON "CleaningTeamMember"("teamId");
CREATE INDEX "CleaningTeamMember_employeeId_idx" ON "CleaningTeamMember"("employeeId");

CREATE TABLE "CleaningTask" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reservationId" TEXT,
    "teamId" TEXT,
    "assigneeId" TEXT,
    "status" "CleaningTaskStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "durationMin" INTEGER,
    "notes" TEXT,
    "checklistTemplate" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CleaningTask_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CleaningTask_organizationId_idx" ON "CleaningTask"("organizationId");
CREATE INDEX "CleaningTask_propertyId_idx" ON "CleaningTask"("propertyId");
CREATE INDEX "CleaningTask_reservationId_idx" ON "CleaningTask"("reservationId");
CREATE INDEX "CleaningTask_teamId_idx" ON "CleaningTask"("teamId");
CREATE INDEX "CleaningTask_assigneeId_idx" ON "CleaningTask"("assigneeId");
CREATE INDEX "CleaningTask_status_idx" ON "CleaningTask"("status");
CREATE INDEX "CleaningTask_scheduledAt_idx" ON "CleaningTask"("scheduledAt");
CREATE INDEX "CleaningTask_organizationId_status_idx" ON "CleaningTask"("organizationId", "status");

CREATE TABLE "CleaningChecklistItem" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "employeeId" TEXT,
    "label" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CleaningChecklistItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CleaningChecklistItem_taskId_idx" ON "CleaningChecklistItem"("taskId");
CREATE INDEX "CleaningChecklistItem_employeeId_idx" ON "CleaningChecklistItem"("employeeId");

CREATE TABLE "CleaningPhoto" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CleaningPhoto_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CleaningPhoto_taskId_idx" ON "CleaningPhoto"("taskId");

-- ─── Maintenance ─────────────────────────────────────────────────────────────

CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "vendorId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Technician_organizationId_idx" ON "Technician"("organizationId");
CREATE INDEX "Technician_vendorId_idx" ON "Technician"("vendorId");
CREATE INDEX "Technician_isActive_idx" ON "Technician"("isActive");

CREATE TABLE "MaintenanceTicket" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "vendorId" TEXT,
    "technicianId" TEXT,
    "assigneeUserId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'OPEN',
    "category" TEXT,
    "costEstimate" DECIMAL(12,2),
    "costActual" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MaintenanceTicket_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MaintenanceTicket_organizationId_idx" ON "MaintenanceTicket"("organizationId");
CREATE INDEX "MaintenanceTicket_propertyId_idx" ON "MaintenanceTicket"("propertyId");
CREATE INDEX "MaintenanceTicket_status_idx" ON "MaintenanceTicket"("status");
CREATE INDEX "MaintenanceTicket_priority_idx" ON "MaintenanceTicket"("priority");
CREATE INDEX "MaintenanceTicket_technicianId_idx" ON "MaintenanceTicket"("technicianId");
CREATE INDEX "MaintenanceTicket_assigneeUserId_idx" ON "MaintenanceTicket"("assigneeUserId");
CREATE INDEX "MaintenanceTicket_organizationId_status_idx" ON "MaintenanceTicket"("organizationId", "status");

CREATE TABLE "MaintenancePhoto" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "takenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MaintenancePhoto_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MaintenancePhoto_ticketId_idx" ON "MaintenancePhoto"("ticketId");

-- ─── Check-in / Check-out ────────────────────────────────────────────────────

CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestId" TEXT,
    "status" "CheckInStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "method" TEXT,
    "accessCode" TEXT,
    "notes" TEXT,
    "checklist" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CheckIn_organizationId_idx" ON "CheckIn"("organizationId");
CREATE INDEX "CheckIn_propertyId_idx" ON "CheckIn"("propertyId");
CREATE INDEX "CheckIn_reservationId_idx" ON "CheckIn"("reservationId");
CREATE INDEX "CheckIn_status_idx" ON "CheckIn"("status");
CREATE INDEX "CheckIn_scheduledAt_idx" ON "CheckIn"("scheduledAt");

CREATE TABLE "CheckOut" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reservationId" TEXT,
    "guestId" TEXT,
    "status" "CheckOutStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "method" TEXT,
    "notes" TEXT,
    "damages" JSONB,
    "checklist" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CheckOut_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CheckOut_organizationId_idx" ON "CheckOut"("organizationId");
CREATE INDEX "CheckOut_propertyId_idx" ON "CheckOut"("propertyId");
CREATE INDEX "CheckOut_reservationId_idx" ON "CheckOut"("reservationId");
CREATE INDEX "CheckOut_status_idx" ON "CheckOut"("status");
CREATE INDEX "CheckOut_scheduledAt_idx" ON "CheckOut"("scheduledAt");

-- ─── Inventory ───────────────────────────────────────────────────────────────

CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'unit',
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "minQuantity" DECIMAL(12,3),
    "unitCost" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "location" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "InventoryItem_organizationId_idx" ON "InventoryItem"("organizationId");
CREATE INDEX "InventoryItem_propertyId_idx" ON "InventoryItem"("propertyId");
CREATE INDEX "InventoryItem_sku_idx" ON "InventoryItem"("sku");
CREATE INDEX "InventoryItem_category_idx" ON "InventoryItem"("category");

CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "employeeId" TEXT,
    "type" "InventoryLogType" NOT NULL,
    "quantityDelta" DECIMAL(12,3) NOT NULL,
    "quantityAfter" DECIMAL(12,3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "InventoryLog_organizationId_idx" ON "InventoryLog"("organizationId");
CREATE INDEX "InventoryLog_itemId_idx" ON "InventoryLog"("itemId");
CREATE INDEX "InventoryLog_type_idx" ON "InventoryLog"("type");
CREATE INDEX "InventoryLog_createdAt_idx" ON "InventoryLog"("createdAt");

-- ─── Messaging ───────────────────────────────────────────────────────────────

CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT,
    "reservationId" TEXT,
    "guestId" TEXT,
    "channel" "MessageChannel" NOT NULL,
    "externalId" TEXT,
    "subject" TEXT,
    "status" "ThreadStatus" NOT NULL DEFAULT 'OPEN',
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MessageThread_organizationId_idx" ON "MessageThread"("organizationId");
CREATE INDEX "MessageThread_propertyId_idx" ON "MessageThread"("propertyId");
CREATE INDEX "MessageThread_reservationId_idx" ON "MessageThread"("reservationId");
CREATE INDEX "MessageThread_guestId_idx" ON "MessageThread"("guestId");
CREATE INDEX "MessageThread_channel_idx" ON "MessageThread"("channel");
CREATE INDEX "MessageThread_status_idx" ON "MessageThread"("status");
CREATE INDEX "MessageThread_externalId_idx" ON "MessageThread"("externalId");
CREATE INDEX "MessageThread_lastMessageAt_idx" ON "MessageThread"("lastMessageAt");

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "channel" "MessageChannel" NOT NULL,
    "direction" "MessageDirection" NOT NULL DEFAULT 'INBOUND',
    "externalId" TEXT,
    "body" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "attachments" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Message_organizationId_idx" ON "Message"("organizationId");
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");
CREATE INDEX "Message_channel_idx" ON "Message"("channel");
CREATE INDEX "Message_direction_idx" ON "Message"("direction");
CREATE INDEX "Message_externalId_idx" ON "Message"("externalId");
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt");
CREATE INDEX "Message_senderUserId_idx" ON "Message"("senderUserId");

-- ─── Reports & Settings ──────────────────────────────────────────────────────

CREATE TABLE "ReportSnapshot" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "reportKey" TEXT NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "metrics" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ReportSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ReportSnapshot_organizationId_reportKey_periodStart_periodEnd_key" ON "ReportSnapshot"("organizationId", "reportKey", "periodStart", "periodEnd");
CREATE INDEX "ReportSnapshot_organizationId_idx" ON "ReportSnapshot"("organizationId");
CREATE INDEX "ReportSnapshot_reportKey_idx" ON "ReportSnapshot"("reportKey");
CREATE INDEX "ReportSnapshot_periodStart_periodEnd_idx" ON "ReportSnapshot"("periodStart", "periodEnd");

CREATE TABLE "OrganizationSettings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "defaultCheckInTime" TEXT NOT NULL DEFAULT '16:00',
    "defaultCheckOutTime" TEXT NOT NULL DEFAULT '11:00',
    "defaultCurrency" TEXT NOT NULL DEFAULT 'EUR',
    "defaultLocale" TEXT NOT NULL DEFAULT 'fr',
    "defaultTimezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "invoicePrefix" TEXT,
    "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1,
    "vatRate" DECIMAL(5,2),
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifySms" BOOLEAN NOT NULL DEFAULT false,
    "features" JSONB,
    "branding" JSONB,
    "integrations" JSONB,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OrganizationSettings_organizationId_key" ON "OrganizationSettings"("organizationId");

CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Setting_organizationId_key_key" ON "Setting"("organizationId", "key");
CREATE INDEX "Setting_organizationId_idx" ON "Setting"("organizationId");
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- ─── Pricing ─────────────────────────────────────────────────────────────────

CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT,
    "type" "PricingRuleType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2),
    "percent" DECIMAL(7,4),
    "minNights" INTEGER,
    "maxNights" INTEGER,
    "startDate" DATE,
    "endDate" DATE,
    "daysOfWeek" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PricingRule_organizationId_idx" ON "PricingRule"("organizationId");
CREATE INDEX "PricingRule_propertyId_idx" ON "PricingRule"("propertyId");
CREATE INDEX "PricingRule_type_idx" ON "PricingRule"("type");
CREATE INDEX "PricingRule_startDate_endDate_idx" ON "PricingRule"("startDate", "endDate");
CREATE INDEX "PricingRule_isActive_idx" ON "PricingRule"("isActive");
CREATE INDEX "PricingRule_organizationId_propertyId_type_idx" ON "PricingRule"("organizationId", "propertyId", "type");

-- ─── Automations ─────────────────────────────────────────────────────────────

CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" "AutomationTrigger" NOT NULL,
    "conditions" JSONB,
    "actions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AutomationRule_organizationId_idx" ON "AutomationRule"("organizationId");
CREATE INDEX "AutomationRule_trigger_idx" ON "AutomationRule"("trigger");
CREATE INDEX "AutomationRule_isActive_idx" ON "AutomationRule"("isActive");

CREATE TABLE "AutomationRun" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "status" "AutomationRunStatus" NOT NULL DEFAULT 'PENDING',
    "triggerPayload" JSONB,
    "result" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AutomationRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AutomationRun_organizationId_idx" ON "AutomationRun"("organizationId");
CREATE INDEX "AutomationRun_ruleId_idx" ON "AutomationRun"("ruleId");
CREATE INDEX "AutomationRun_status_idx" ON "AutomationRun"("status");
CREATE INDEX "AutomationRun_createdAt_idx" ON "AutomationRun"("createdAt");

-- ─── Channel Manager ─────────────────────────────────────────────────────────

CREATE TABLE "ChannelConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "ChannelProvider" NOT NULL,
    "status" "ChannelConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "accountName" TEXT,
    "credentialsEnc" JSONB,
    "credentialsKeyId" TEXT,
    "metadata" JSONB,
    "lastSyncAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChannelConnection_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ChannelConnection_organizationId_provider_accountName_key" ON "ChannelConnection"("organizationId", "provider", "accountName");
CREATE INDEX "ChannelConnection_organizationId_idx" ON "ChannelConnection"("organizationId");
CREATE INDEX "ChannelConnection_provider_idx" ON "ChannelConnection"("provider");
CREATE INDEX "ChannelConnection_status_idx" ON "ChannelConnection"("status");

CREATE TABLE "ChannelListing" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "propertyId" TEXT,
    "provider" "ChannelProvider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUrl" TEXT,
    "title" TEXT,
    "status" TEXT,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ChannelListing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ChannelListing_connectionId_externalId_key" ON "ChannelListing"("connectionId", "externalId");
CREATE INDEX "ChannelListing_organizationId_idx" ON "ChannelListing"("organizationId");
CREATE INDEX "ChannelListing_connectionId_idx" ON "ChannelListing"("connectionId");
CREATE INDEX "ChannelListing_propertyId_idx" ON "ChannelListing"("propertyId");
CREATE INDEX "ChannelListing_provider_idx" ON "ChannelListing"("provider");
CREATE INDEX "ChannelListing_externalId_idx" ON "ChannelListing"("externalId");

CREATE TABLE "PropertyChannelMapping" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "provider" "ChannelProvider" NOT NULL,
    "externalListingId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "syncCalendar" BOOLEAN NOT NULL DEFAULT true,
    "syncPricing" BOOLEAN NOT NULL DEFAULT true,
    "syncContent" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PropertyChannelMapping_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PropertyChannelMapping_propertyId_connectionId_externalListingId_key" ON "PropertyChannelMapping"("propertyId", "connectionId", "externalListingId");
CREATE INDEX "PropertyChannelMapping_organizationId_idx" ON "PropertyChannelMapping"("organizationId");
CREATE INDEX "PropertyChannelMapping_propertyId_idx" ON "PropertyChannelMapping"("propertyId");
CREATE INDEX "PropertyChannelMapping_connectionId_idx" ON "PropertyChannelMapping"("connectionId");
CREATE INDEX "PropertyChannelMapping_provider_idx" ON "PropertyChannelMapping"("provider");
CREATE INDEX "PropertyChannelMapping_externalListingId_idx" ON "PropertyChannelMapping"("externalListingId");

-- ─── Webhooks, AI, Audit ─────────────────────────────────────────────────────

CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "connectionId" TEXT,
    "provider" "ChannelProvider",
    "eventType" TEXT NOT NULL,
    "externalId" TEXT,
    "status" "WebhookEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "payload" JSONB NOT NULL,
    "headers" JSONB,
    "error" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "WebhookEvent_organizationId_idx" ON "WebhookEvent"("organizationId");
CREATE INDEX "WebhookEvent_connectionId_idx" ON "WebhookEvent"("connectionId");
CREATE INDEX "WebhookEvent_provider_idx" ON "WebhookEvent"("provider");
CREATE INDEX "WebhookEvent_eventType_idx" ON "WebhookEvent"("eventType");
CREATE INDEX "WebhookEvent_status_idx" ON "WebhookEvent"("status");
CREATE INDEX "WebhookEvent_externalId_idx" ON "WebhookEvent"("externalId");
CREATE INDEX "WebhookEvent_createdAt_idx" ON "WebhookEvent"("createdAt");

CREATE TABLE "AiJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "type" "AiJobType" NOT NULL,
    "status" "AiJobStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "model" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AiJob_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AiJob_organizationId_idx" ON "AiJob"("organizationId");
CREATE INDEX "AiJob_userId_idx" ON "AiJob"("userId");
CREATE INDEX "AiJob_type_idx" ON "AiJob"("type");
CREATE INDEX "AiJob_status_idx" ON "AiJob"("status");
CREATE INDEX "AiJob_createdAt_idx" ON "AiJob"("createdAt");

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "AuditLog"("resourceType", "resourceId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- ─── Foreign keys ────────────────────────────────────────────────────────────

ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Guest" ADD CONSTRAINT "Guest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Property" ADD CONSTRAINT "Property_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CalendarBlock" ADD CONSTRAINT "CalendarBlock_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CalendarBlock" ADD CONSTRAINT "CalendarBlock_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Employee" ADD CONSTRAINT "Employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningTeam" ADD CONSTRAINT "CleaningTeam_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningTeam" ADD CONSTRAINT "CleaningTeam_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CleaningTeamMember" ADD CONSTRAINT "CleaningTeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "CleaningTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningTeamMember" ADD CONSTRAINT "CleaningTeamMember_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CleaningTask" ADD CONSTRAINT "CleaningTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningTask" ADD CONSTRAINT "CleaningTask_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningTask" ADD CONSTRAINT "CleaningTask_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CleaningTask" ADD CONSTRAINT "CleaningTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "CleaningTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CleaningTask" ADD CONSTRAINT "CleaningTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CleaningChecklistItem" ADD CONSTRAINT "CleaningChecklistItem_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CleaningTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CleaningChecklistItem" ADD CONSTRAINT "CleaningChecklistItem_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CleaningPhoto" ADD CONSTRAINT "CleaningPhoto_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CleaningTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Technician" ADD CONSTRAINT "Technician_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MaintenanceTicket" ADD CONSTRAINT "MaintenanceTicket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaintenanceTicket" ADD CONSTRAINT "MaintenanceTicket_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaintenanceTicket" ADD CONSTRAINT "MaintenanceTicket_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MaintenanceTicket" ADD CONSTRAINT "MaintenanceTicket_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MaintenanceTicket" ADD CONSTRAINT "MaintenanceTicket_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MaintenancePhoto" ADD CONSTRAINT "MaintenancePhoto_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "MaintenanceTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CheckOut" ADD CONSTRAINT "CheckOut_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReportSnapshot" ADD CONSTRAINT "ReportSnapshot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationSettings" ADD CONSTRAINT "OrganizationSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AutomationRule" ADD CONSTRAINT "AutomationRule_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomationRun" ADD CONSTRAINT "AutomationRun_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "AutomationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ChannelConnection" ADD CONSTRAINT "ChannelConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChannelListing" ADD CONSTRAINT "ChannelListing_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChannelListing" ADD CONSTRAINT "ChannelListing_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "ChannelConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChannelListing" ADD CONSTRAINT "ChannelListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PropertyChannelMapping" ADD CONSTRAINT "PropertyChannelMapping_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyChannelMapping" ADD CONSTRAINT "PropertyChannelMapping_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyChannelMapping" ADD CONSTRAINT "PropertyChannelMapping_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "ChannelConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "ChannelConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiJob" ADD CONSTRAINT "AiJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AiJob" ADD CONSTRAINT "AiJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
