import { test, expect, Page } from '@playwright/test';
  async function loginToLoanApp(page:Page, branch: string, user: string,pass: string) {

  //Navigate to the Login Application Area
  await page.goto('https://qa.hitekschool.com/lms/3108/login');

  //Locate Branch text box and enter branch name using getByLabel
  await page.getByLabel( 'Branch Name*').fill(branch);

  //Locate User Name text box and enter username using getByLabel
  await page.getByLabel('User Name*').fill(user);

  //Locate Password text box and enter password using getByLabel
  await page.getByLabel('Password*' ).fill(pass);

  //Click Sign in button(kept as getByRole because it is a button action)
  await page.getByRole('button', { name: 'Sign in' }).click();

  //Assertion to validate successful navigation to Dashboard page
  await expect(page.getByRole('main')).toContainText(`Welcome ${user}`);
  }
async function logout(page: Page){ 
  //Click Logout button(kept as getByRole  because it is a button action) 
  await page.getByRole('button', { name: 'Log out' }).click();

  //Assertion to validate successful logout
  await expect(page.getByRole('heading')).toContainText('Sign in to your Branch account');
}
test('test', async ({ page }) => {
  await loginToLoanApp(page, 'Auburn', 'admin', 'tvogt0305');
  await logout(page);
});