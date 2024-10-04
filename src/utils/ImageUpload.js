import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }) => {
    const [image, setImage] = useState("");

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/duoumxdo6/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setImage(data.secure_url); // Store the URL of the uploaded image
            onImageUpload(data.secure_url); // Call the parent function with the image URL
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={uploadImage} />
        </div>
    );
};

export default ImageUpload;