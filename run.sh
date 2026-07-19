#!/bin/bash

# Start backend and frontend servers together
echo "Starting Tanmay Site..."

# Start backend
cd backend
PYTHONPATH=$(pwd) python3 -m uvicorn server:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Backend running on http://localhost:8000"
echo "✅ Frontend running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
