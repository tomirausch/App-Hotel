export const minusculaConPrimeraMayuscula = (string) =>{
    if(string.includes(" ")){
        let stringDividido = string.split(" ");

        const stringCap = stringDividido.map((string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
        })

        return stringCap.join(" ");
    }
    return (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase());
}