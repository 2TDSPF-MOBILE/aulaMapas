import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React,{useState,useEffect} from 'react';

//Biblioteca de localização
import * as Location from 'expo-location'

//Importação do Mapas
import MapView,{Marker} from 'react-native-maps'

export default function App() {
  // Estado para armazenar localizaçãp (coordenadas->Latitude e Longitude)
  const[location,setLocation]=useState(null)

  // Estado para guardar o endereço obtido de acordo com as coordenadas
  const[address,setAddress] = useState(null)

  //Estado para armazenar a permissão de acesso a localização
  const[permission,setPermission] = useState(null)

  //Executado uma vez na inicialização do app
  useEffect(()=>{
    (async()=>{
      //Solicitando permissao para acessar localizacão
      const{status} = await Location.requestForegroundPermissionsAsync()
      setPermission(status)//Armazena o status da permisão
      
      //Se a permissao foi concedida
      if(status === 'granted'){
        //Obter a localização do dispositivo
        const userLocation = await Location.getCurrentPositionAsync({})
        setLocation(userLocation.coords)//Salvar a latitude e longitude

        //Converter a latitude e longitude em um endereço
        const addressResult = await Location.reverseGeocodeAsync(userLocation.coords)
        setAddress(addressResult[0])//Armazenar o endereço mais relevante
      }else{
        return(
          <View style={styles.container}>
            <Text>Permissao de localização não concedida</Text>
          </View>
        )
      }

    })
  },[])

  //Função para exibir o endereço
  const renderAddress = () =>{
    if(!address) return <Text>Carregando endereço...</Text>

    const street = address?.street || 'Rua não encontrada'
    const city = address?.city || 'Cidade não encontrada'
    const region = address?.region || 'Estado não encontrado'
    const country = address?.country || 'País não encontrado'
    const postalCode = address?.postalCode || 'CEP não encontrado'

    return(
      <View>
        <Text>Endereço Completo</Text>
        <Text>{street}</Text>
        <Text>{city}{region}</Text>
        <Text>{postalCode}</Text>
        <Text>{country}</Text>
      </View>
    )
  }

  console.log(address)

  return (
    
    <View style={styles.container}>
      {renderAddress()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
