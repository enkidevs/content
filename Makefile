BIN_DIR ?= node_modules/.bin

BUILD_DIST ?= dist
BUILD_TARGET ?= tests/parser.js
BUILD_FLAGS ?= --out-dir $(BUILD_DIST)

TEST_FLAGS ?= --require babel-register

P="\\033[34m[+]\\033[0m"

#
# CLEAN
#

clean:
	echo "  $(P) Cleaning"
	rm -rf build/

#
# BUILD
#

build: clean
	echo "  $(P) Building"
	$(BIN_DIR)/babel $(BUILD_TARGET) $(BUILD_FLAGS)

build-watch: clean
	echo "  $(P) Building forever"
	$(BIN_DIR)/babel $(BUILD_TARGET) $(BUILD_FLAGS) --watch

#
# TEST
#

lint:
	echo "  $(P) Linting"
	$(BIN_DIR)/eslint $(BUILD_TARGET)

test: lint
	echo "  $(P) Testing"
	NODE_ENV=test $(BIN_DIR)/ava $(TEST_FLAGS)

test-watch:
	echo "  $(P) Testing forever"
	NODE_ENV=test $(BIN_DIR)/ava --watch $(TEST_FLAGS)

#
# MAKEFILE
#

.PHONY: \
	clean \
	build build-watch \
	lint test test-watch

.SILENT:
