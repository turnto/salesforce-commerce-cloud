# Emplifi's Salesforce Commerce Cloud TurnTo Ratings & Reviews Cartridge

Emplifi provides this cartridge to integrate with [Salesforce Commerce Cloud (SFCC)](https://www.adyen.com/partners/salesforce-commerce-cloud). 
This cartridge enabled customers to submit product ratings and review and displays them on the SFCC storefront. This
cartridge supports SFRA and SiteGenesis Javascript Controllers (legacy).

## Requirements

This cartridge requires an active Emplifi TurnTo Ratings & Reviews account. Contact Emplifi support
to set up a [new account](https://emplifi.io/products/social-commerce/ratings-and-reviews#book-a-demo).

## Validation
Please follow the below steps to validate that you have successfully installed the Emplifi Ratings & Reviews cartridge.

* In SFCC Business Manager
  * Go to **Merchant Tools > Site Preferences > Custom Preference**
  * Setup site settings according to steps above.
  * Go to **Administration > Operations > Jobs**.
  * Run the TurnToExportCatalog Job and wait for the job to finish.
* In TurnTo account dashboard
  * Check that the data was imported to the TurnTo site. The TurnTo dashboard should contain information about the imported data. Status of data - New. Wait until the status of imported data is Complete.
* In SFCC website storefront
  * Select any product and go to the PDP page
  * On the PDP page, confirm widgets for customer ratings teaser and ratings & reviews for the product appear
  * Click on the button to "write a review" on the PDP page. Fill out the feedback form and click the **Submit** button
* In TurnTo account dashboard 
  * Your review should appear in your Inbox on the Moderate Reviews page as shown below
  * Click on the button SUBMIT to make the review appear on the storefront
* In SFCC website storefront
  * Confirm the review can now be seen on the PDP page of the product in the storefront

## Platform
Emplifi's TurnTo Ratings & Reviews platform documentation can be found at https://docs.turnto.com/.
