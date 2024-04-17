import React from 'react'
import styles from './deletemodal.style.module.css'
import 'react-toastify/dist/ReactToastify.css';

interface DeleteProps {
    type: string
    id: string
    handleModal : ()=>void
}

const DeleteModal = ({ type, id, handleModal}: DeleteProps) => {

    const handleDelete = async () => {
        const baseURL = process.env.NEXT_PUBLIC_EVENTGENI_URL;
        const url = `${baseURL}/widgets/${id}?type=${type}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('Failed to delete the widget:', response.status, response.statusText);
                return;
            }
            console.log('Widget deleted successfully');
            // Remove the deleted widget ID from local storage
            const widgets = JSON.parse(localStorage.getItem('widgets') || '[]');
            const updatedWidgets = widgets.filter((widget: any) => widget.id !== id);
            localStorage.setItem('widgets', JSON.stringify(updatedWidgets));
        } catch (error) {
            console.error('An error occurred while deleting the widget:', error);
        }
        handleModal()
    };
    


    return (
        <div className={styles.container}>
            <div>Are you sure you want to Delete the Widget ?</div>
            <div className={styles.btns}>
                <button className={styles.delete} onClick={handleDelete}>Delete</button>
                <button className={styles.cancel} onClick={handleModal} >Cancel</button>
            </div>
        </div>
    )
}

export default DeleteModal