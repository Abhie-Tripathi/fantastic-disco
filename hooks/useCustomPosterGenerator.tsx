import { createCanvas, loadImage } from 'canvas';

export async function generateCustomPoster(eventName : string, logoUrl : string) {
  const width = 1200; // Width of the poster
  const height = 630; // Height of the poster
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Set background color (optional)
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);

  // Load the user's uploaded poster image
  const userPoster = await loadImage(logoUrl);
  // Draw the user's poster on the right half of the canvas
  const posterWidth = width / 2;
  context.drawImage(userPoster, width / 2, 0, posterWidth, height);

  // Add event name text on the left side
  context.font = 'bold 60px Arial';
  context.fillStyle = '#000000';
  context.textAlign = 'left';
  context.fillText(eventName, 50, 100); // Position of the event name

  // Convert the canvas to a buffer
  return canvas.toBuffer('image/png');
}
