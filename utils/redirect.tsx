export const redirectToSignin = () => {
    if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      } else {
        console.log('window is undefined, cannot redirect');
      }
  };