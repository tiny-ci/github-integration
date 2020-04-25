.DEFAULT_GOAL := bundle
DIST = dist
ARTIFACT = tiny-ci-github-integration-bundle.zip

clean:
	@rm -rf $(DIST) *.zip

bundle: clean
	@npm run build
	@cp package.json package-lock.json dist
	@cd $(DIST) && \
		npm i --production && \
		find ./node_modules -type d -exec chmod 755 {} \; && \
		find ./node_modules -type f -exec chmod 644 {} \; && \
		zip -r $(ARTIFACT) . && \
		cd ..
	@cp $(DIST)/$(ARTIFACT) .
