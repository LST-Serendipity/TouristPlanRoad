export const deviceType=()=>{
  if(window.innerWidth<1024){
    return 'mobile'
  }
  return 'desktop'
}
