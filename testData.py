import requests
import json
import time

test_users = [
    {
        'firstName': 'John',
        'lastName': 'Smith', 
        'user': 'john_smith',         
        'password': 'password123',
        'confirm': 'password123',    
        'age': 28,
        'salary': 75000
    },
    {
        'firstName': 'Sarah',
        'lastName': 'Johnson',
        'user': 'sarah_j', 
        'password': 'password123',
        'confirm': 'password123',
        'age': 32,
        'salary': 82000
    },
    {
        'firstName': 'Michael',
        'lastName': 'Brown',
        'user': 'mike_brown',
        'password': 'password123',
        'confirm': 'password123',
        'age': 25,
        'salary': 68000
    },
    {
        'firstName': 'Emma',
        'lastName': 'Davis',
        'user': 'emma_d',
        'password': 'password123',
        'confirm': 'password123',
        'age': 35,
        'salary': 91000
    },
    {
        'firstName': 'David',
        'lastName': 'Wilson',
        'user': 'dave_w',
        'password': 'password123',
        'confirm': 'password123',
        'age': 22,
        'salary': 55000
    }
]

def register_user(user):
    try:
        print(f"\nTrying to register: {user['user']}")
        print(f"Sending data: {json.dumps(user, indent=2)}")
        
        response = requests.post(
            'http://localhost:5050/register',
            json=user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Raw response: {response.text}")
        
        if response.status_code == 201:  # Your app.js returns 201 for success
            print(f"SUCCESS: {user['user']} registered")
            return True
        else:
            try:
                result = response.json()
                print(f"FAILED: {user['user']} - {result}")
            except:
                print(f"FAILED: {user['user']} - Status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {str(e)}")
        return False

def main():
    print("Testing user registration with correct field names...")
    
    # Test server connection
    try:
        response = requests.get('http://localhost:5050/', timeout=5)
        print(f"Server is running - Status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Server connection failed: {e}")
        return
    
    success_count = 0
    fail_count = 0
    
    for user in test_users:
        success = register_user(user)
        if success:
            success_count += 1
        else:
            fail_count += 1
        time.sleep(0.5)
    
    print(f"\nRegistration Summary:")
    print(f"Successful: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Total: {len(test_users)}")

if __name__ == "__main__":
    main()