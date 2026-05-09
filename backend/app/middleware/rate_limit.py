from fastapi import Request, HTTPException, status
import time
from collections import defaultdict

# A very simple in-memory rate limiter for production-ready demonstration
# In a real production app, use Redis for this.
class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)

    async def __call__(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old requests
        self.requests[client_ip] = [t for t in self.requests[client_ip] if current_time - t < 60]
        
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        self.requests[client_ip].append(current_time)
        response = await call_next(request)
        return response

rate_limiter = RateLimiter(requests_per_minute=100)
