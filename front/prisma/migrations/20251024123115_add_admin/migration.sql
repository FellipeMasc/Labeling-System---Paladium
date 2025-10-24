-- CreateTable
CREATE TABLE "admin" (
    "user_id" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
