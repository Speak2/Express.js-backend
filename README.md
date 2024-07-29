# Backend Project

## Overview

This is the backend service for Airbnb_clone, designed to handle API requests, manage data, and serve the front-end application. Built with Node.js and Express.js, this project connects to a PostgreSQL database to provide dynamic data.




## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/rahul4019/airbnb-clone.git

   ```

2. **Install dependencies:**

   Navigate to client directory and install backend dependencies using npm

   ```
   npm init -y
   npm install express pg multer cors
   ```
 

3. **database connection variables:**

    navigate to config folder and create the database.json file
    using client database user login,password and port address
   
   

4. **Run project:**
   
   - Open terminal, navigate to back-end directory and run this command to start backend server
   ```
       npm start
   ```

5. **Create the database:**

    using the following sql command create two tables on the database to work with the backend
  ```
    -- Create the hotels table

    CREATE TABLE hotels (
    slug VARCHAR(255) PRIMARY KEY,
    images BYTEA[],
    title VARCHAR(255) NOT NULL,
    description TEXT,
    guest_count INTEGER,
    bedroom_count INTEGER,
    bathroom_count INTEGER,
    amenities TEXT[],
    host_information JSONB,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    amenities_icon_logos BYTEA[],
    host_image BYTEA,
    co_host_images BYTEA[]
);

-- Create the updated rooms table

    CREATE TABLE rooms (
    hotel_slug VARCHAR(255) REFERENCES hotels(slug),
    room_slug VARCHAR(255),
    room_images BYTEA[],
    room_title VARCHAR(255) NOT NULL,
    bedroom_count INTEGER,
    PRIMARY KEY (hotel_slug, room_slug)
);
   ```
 

## Features

- **RESTful API:** RESTful API endpoints for various operations. 
- **Dynamic database loadinn** Integration with PostgreSQL database

- **Error Handling** Error handling and validation is done using try and catch blocks

## API Endpoints
 


1. POST /api/hotels/: post the hotel information into the database.

2. POST /api/hotels/hotel-slug/: post the room information of a hotel into the database
3. GET /api/hotels/hotel-slug/: fetch the hotel information using hotel slug
4. GET /api/rooms/hotel-slug/: fetch all the room information of a hotel using hotel slug
5. GET /api/rooms/hotel-slug/room-slug/: fetch a specific room information of a hotel using 

 

## Technologies Used

- **Node.js:**  JavaScript runtime for building server-side applications
- **Express.js:** Web framework for Node.js
- **PostgreSQL:** Relational database management system


## Technologies Used

  **Author:** Nahid Mahamud

  **Email:** nahid.nm91@gmail.com

  **GitHub:** [Nahid Mahamud](https://github.com/Speak2)
 
