-- CreateTable
CREATE TABLE "public"."User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rid" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "public"."User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomId_key" ON "public"."Room"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "public"."Room"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_rid_fkey" FOREIGN KEY ("rid") REFERENCES "public"."Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
