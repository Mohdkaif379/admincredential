-- Run this on an existing database to sync schema after removing `account_locked_until`.
ALTER TABLE admins
  DROP COLUMN account_locked_until;

