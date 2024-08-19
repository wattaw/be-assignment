-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PaymentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PaymentAccount" ADD CONSTRAINT "PaymentAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "PaymentAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
