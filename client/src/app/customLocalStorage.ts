export const customLocalStorage = () => {
  return {
    userInfo:
      typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(
            typeof window !== 'undefined' && localStorage.getItem('userInfo')
          )
        : null,

  }
}

export const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
     
    },
  }
}
