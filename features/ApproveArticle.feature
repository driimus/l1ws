Feature: Pending article approval

	Background:
		Given the user Doej has an account
		And a pending article titled 'All the fish' posted by Doej

	Scenario: Approve a pending article
		Given the latest article gets approved
		When I visit the 'home' page
		Then 1 article should be listed
		And 'All the fish' should be displayed
