updateBuildArtifcats:
	# Handles process for updating dependencies and generating build artifacts.
	# If you are on a different branch, or don't want to pull, you can run
	# this after fetching changes from a separate branch to ensure everything
	# is up to date
	npm install
	npm run buildProd

update:
	# Pulls changes from the default branch and updates dependencies and build
	# artifacts
	@echo "Updating repository and building..."
	git pull
	@make updateBuildArtifcats
