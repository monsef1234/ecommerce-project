-- CreateTable
CREATE TABLE "public"."settings" (
    "id" SERIAL NOT NULL,
    "storeName" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "phone3" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
