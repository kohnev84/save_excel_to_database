import React, { useState, useEffect } from 'react';

function AddFlie() {

    return (
        <>
            <form action="http://localhost:5000/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="ited" />
                <input type="submit" />
            </form>
        </>
    )
}

export default AddFlie