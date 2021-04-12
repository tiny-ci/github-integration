.DEFAULT_GOAL := bundle
DIST = dist
ARTIFACT = tiny-ci-github-integration-bundle.zip

clean:
	@rm -rf $(DIST) *.zip

bundle: clean
	@npm run build
	@cd $(DIST) && \
		zip -r $(ARTIFACT) main.js && \
		cd ..
	@cp $(DIST)/$(ARTIFACT) .
