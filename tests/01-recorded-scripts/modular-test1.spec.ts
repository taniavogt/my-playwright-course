import { test, expect, Page } from '@playwright/test';
// Go up one folder, then look inside the functions folder
 import { loginToLoanApp, logout } from '../../functions/authFunctions';

test('test', async ({ page }) => {
  // Call the reusable login function
  await loginToLoanApp(page, 'Auburn', 'admin', 'tvogt0305');
  
  //Call the reusable logout function
  await logout(page);
});