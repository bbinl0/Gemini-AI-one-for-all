"""
Vercel Serverless Function Entry Point
=====================================

This file serves as the entry point for Vercel serverless deployment.
It imports the Flask app and makes it available to Vercel's runtime.
"""

from app import app

# Export the Flask app for Vercel
# Vercel will use this as the serverless function handler
if __name__ == "__main__":
    app.run()