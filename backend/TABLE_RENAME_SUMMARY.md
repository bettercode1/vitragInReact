# Database Table Rename Migration Summary

## Overview
This document summarizes the changes made to standardize database table names in the Vitrag Associates Testing Lab application.

## Problem
The original table names were inconsistent and didn't follow proper naming conventions:
- Some tables used singular names, others plural
- Inconsistent naming patterns
- Foreign key references were inconsistent

## Solution
All table names have been standardized to follow these conventions:
- **Plural names**: All table names are now plural (e.g., `customers`, `test_requests`)
- **Snake case**: All names use snake_case format
- **Consistent foreign keys**: All foreign key references updated to use new table names

## Table Name Changes

| Old Name | New Name | Description |
|----------|----------|-------------|
| `customer` | `customers` | Customer information |
| `test_request` | `test_requests` | Main test request data |
| `concrete_test` | `concrete_tests` | Concrete cube/core test results |
| `testing_material` | `testing_materials` | Other materials being tested |
| `test_photo` | `test_photos` | Test photos of concrete specimens |
| `sequence_counter` | `sequence_counters` | Job number sequence tracking |
| `machine` | `machine` | Machine calibration management |
| `liquid_admixture_test` | `liquid_admixture_tests` | Liquid admixture test data |
| `liquid_admixture_reading` | `liquid_admixture_readings` | Individual readings for liquid admixture tests |
| `reviewer` | `reviewers` | Reviewer information |
| `test_review` | `test_reviews` | Test review tracking |
| `bulk_density_moisture_test` | `bulk_density_moisture_tests` | Bulk density and moisture content tests |
| `bulk_density_moisture_reading` | `bulk_density_moisture_readings` | Individual readings for bulk density tests |
| `aac_block_test` | `aac_block_tests` | AAC block compressive strength tests |

## Files Modified

### 1. `models.py`
- Added `__tablename__` attribute to all model classes
- Updated all foreign key references to use new table names
- Maintained all existing functionality and relationships

### 2. `rename_tables_migration.py` (NEW)
- Database migration script to rename existing tables
- Updates foreign key constraints
- Includes safety checks and rollback capabilities
- **IMPORTANT**: Run this script to migrate existing data

### 3. `test_table_renames.py` (NEW)
- Test script to verify the migration works correctly
- Tests table creation, relationships, and foreign keys

## Migration Steps

### For Development/Testing:
1. **Backup your database** (CRITICAL!)
2. Run the migration script:
   ```bash
   cd vitrag/backend
   python rename_tables_migration.py
   ```
3. Test the changes:
   ```bash
   python test_table_renames.py
   ```

### For Production:
1. **Create a full database backup**
2. Test the migration on a copy of production data
3. Run the migration during maintenance window
4. Verify all functionality works correctly
5. Update any external systems that reference table names

## Benefits

1. **Consistency**: All table names follow the same naming convention
2. **Clarity**: Plural names clearly indicate collections of records
3. **Maintainability**: Easier to understand and maintain the database schema
4. **Best Practices**: Follows SQL and database naming best practices
5. **Future-Proof**: Consistent naming makes future changes easier

## Verification

After running the migration, verify:
- [ ] All tables have been renamed correctly
- [ ] Foreign key constraints are working
- [ ] Application functionality is not affected
- [ ] All API endpoints work correctly
- [ ] Dashboard and samples pages load properly

## Rollback Plan

If issues occur:
1. Restore from database backup
2. Revert the `models.py` changes
3. Restart the application

## Notes

- The migration script includes safety checks to prevent data loss
- All existing data will be preserved during the rename operation
- The application code doesn't need changes as SQLAlchemy handles the table name mapping
- Foreign key constraints are automatically updated to reference the new table names

## Support

If you encounter any issues during the migration:
1. Check the migration script output for error messages
2. Verify database connectivity and permissions
3. Ensure all required tables exist before running the migration
4. Test in a development environment first
