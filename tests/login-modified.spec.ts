import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  //Navigate to the Login Application Area
  await page.goto('https://qa.hitekschool.com/lms/3108/login');

  //Locate Branch text box and enter branch name using getByLabel
  await page.getByLabel( 'Branch Name*').fill('Auburn');

  //Locate User Name text box and enter username using getByLabel
  await page.getByLabel('User Name*').fill('admin');

  //Locate Password text box and enter password using getByLabel
  await page.getByLabel('Password*' ).fill('tvogt0305');

  //Click Sign in button(kept as getByRole because it is a button action)
  await page.getByRole('button', { name: 'Sign in' }).click();

  //Assertion to validate syuccessful navigation to Dashboard page
  await expect(page.getByRole('main')).toContainText('Welcome admin');

  //Click Logout button(kept as getByRole  because it is a button action) 
  await page.getByRole('button', { name: 'Log out' }).click();

  //Assertion to validate successful logout
  await expect(page.getByRole('heading')).toContainText('Sign in to your Branch account');
});