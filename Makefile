help:
	@echo "Kullanım: make [command]"
	@echo ""
	@echo "Komutlar:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Docker containerları başlatır
	docker-compose up --build

down: ## Docker containerları durdurur
	docker-compose down