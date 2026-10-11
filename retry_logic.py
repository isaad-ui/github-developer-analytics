import math
import random
import time
import requests

MAX_RETRIES = 5            # retries after the first attempt
BASE_DELAY = 1.0           # seconds; doubles each attempt (1, 2, 4, 8, 16...)
MAX_DELAY = 30.0           # cap for a single backoff wait
MAX_RATE_LIMIT_WAIT = 60   # don't sleep longer than this for a rate-limit reset
REQUEST_TIMEOUT = 10       # seconds per request

# Temporary failures worth retrying. 404, 401 and other client errors are not.
RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}






def backoff_delay(attempt):
    """Exponential backoff with jitter: base * 2^attempt, capped, then
    randomized between 50% and 100% so clients don't retry in lockstep."""
    delay = min(MAX_DELAY, BASE_DELAY * (2 ** attempt))
    return random.uniform(delay / 2, delay)





def server_retry_after(response):
    """Seconds GitHub asks us to wait (Retry-After, or rate-limit reset),
    or None if the response doesn't say."""
    retry_after = response.headers.get("Retry-After")

    if retry_after and retry_after.isdigit():
        return int(retry_after)

    if response.headers.get("X-RateLimit-Remaining") == "0":
        reset = response.headers.get("X-RateLimit-Reset")

        if reset and reset.isdigit():
            return max(0, math.ceil(int(reset) - time.time())) + 1

    return None






def request_with_retry(url, params=None, headers=None):
    """GET a URL, retrying temporary failures with exponential backoff.

    Retries on connection errors, timeouts, 429/5xx responses, and 403
    rate-limit responses. Anything else (including 404) is returned
    immediately. If retries run out, the last response is returned so the
    caller's raise_for_status() reports the real error, or the last
    network exception is re-raised.
    """
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = requests.get(
                url,
                params=params,
                headers=headers,
                timeout=REQUEST_TIMEOUT
            )
        except (requests.exceptions.ConnectionError , requests.exceptions.Timeout) as error:
            if attempt == MAX_RETRIES:
                raise

            delay = backoff_delay(attempt)
            print(
                f"Network error ({type(error).__name__}). "
                f"Retrying in {delay:.1f}s "
                f"(attempt {attempt + 1}/{MAX_RETRIES})..."
            )
            time.sleep(delay)
            continue

        wait = server_retry_after(response)

        retryable = (
            response.status_code in RETRYABLE_STATUS_CODES
            or (response.status_code == 403 and wait is not None)
        )

        if not retryable or attempt == MAX_RETRIES:
            return response

        if wait is not None and wait > MAX_RATE_LIMIT_WAIT:
            print(
                f"Rate limited. Limit resets in about {wait // 60} min. "
                f"Set GITHUB_TOKEN for a higher limit."
            )
            return response

        delay = wait if wait is not None else backoff_delay(attempt)
        print(
            f"GitHub returned {response.status_code}. "
            f"Retrying in {delay:.1f}s "
            f"(attempt {attempt + 1}/{MAX_RETRIES})..."
        )
        time.sleep(delay)


