# Mersad AI — Business Rules Extraction Report

## Population
Parsed 16 age bands. Total population = 32,795,091. Saudi share = 53.4%, Non-Saudi share = 46.6%.

## Wages
Latest quarter in data: **2023 / Q2**. Average monthly wage (SAR): Saudi = 9923.6, Non Saudi = 4661.57.

## Consumer Price Index
Months parsed: ['2025-11', '2025-12', '2026-01']. Using **2026-01** as latest.
Note: the Jan 2026 export (Consumer_Price_Index_csv.csv) has malformed quoting in the source file (unescaped commas inside item names) and was recovered with `on_bad_lines='skip'`, losing ~290 of 1540 rows. December 2025 remains the cleanest full month if more precision is needed.
Regions found: ['المملكة', 'الرياض', 'مكة المكرمة', 'المدينة المنورة', 'القصيم', 'المنطقة الشرقية', 'عسير', 'تبوك', 'حائل', 'الحدود الشمالية', 'جازان', 'نجران', 'الباحة', 'الجوف'].

## Household Income & Consumption Expenditure Survey 2023
Extracted 8 income breakdowns, 7 expenditure breakdowns, and full COICOP (12-division) spending category tables by nationality and by region.

## Mersad Expense-Category Mapping
Collapsed 12 official COICOP divisions into 6 Mersad expense buckets (Food, Housing, Transportation, Entertainment, Healthcare, Other). Shares are computed both by nationality and by region so the synthetic generator can allocate a household's total spending realistically.
