# Makefile for Front-Banjay-AI
# Usage: `make <target>`

.PHONY: help install dev build start lint prisma-generate prisma-migrate prisma-seed format clean

SHELL := powershell.exe

help:
	@echo "Available targets:"
	@echo "  install           Install dependencies (npm)"
	@echo "  dev               Run development server"
	@echo "  build             Build the project for production"
	@echo "  start             Start production server (after build)"
	@echo "  lint              Run linter"
	@echo "  prisma-generate   Run 'prisma generate'"
	@echo "  prisma-migrate    Run 'prisma migrate dev --name init'"
	@echo "  prisma-seed       Run prisma seed script"
	@echo "  format            Format code (if prettier/formatter configured)"
	@echo "  clean             Remove .next build output"

install:
	@echo "Installing npm dependencies..."
	npm install

dev:
	@echo "Starting Next.js dev server..."
	npm run dev

build:
	@echo "Building Next.js app..."
	npm run build

start:
	@echo "Starting Next.js production server..."
	npm run start

lint:
	@echo "Running linter..."
	npm run lint

prisma-generate:
	@echo "Running prisma generate..."
	npm run prisma:generate

prisma-migrate:
	@echo "Running prisma migrate (dev)..."
	npm run prisma:migrate

prisma-seed:
	@echo "Running prisma seed..."
	npm run prisma:seed

format:
	@echo "Formatting code (no formatter configured by default)"
	@if exist package.json ( if exist node_modules\.bin\prettier ( npx prettier --write . ) else ( echo "Prettier not installed; run 'npm install --save-dev prettier'" ) ) else ( echo "No package.json found" )

clean:
	@echo "Removing .next directory..."
	@if exist .next ( rmdir /s /q .next ) else ( echo ".next does not exist" )
