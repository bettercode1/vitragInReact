#!/bin/bash

echo "Starting Graph Generation Service..."
echo

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo
echo "Starting Graph Server on port 5001..."
node graph-server.js
