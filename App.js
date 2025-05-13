import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React,{useState,useEffect} from 'react';
import RNPickerSelect from 'react-native-picker-select'
//Biblioteca de localização
import * as Location from 'expo-location'

//Importação do Mapas
import MapView,{Marker} from 'react-native-maps'

const nomeAlunos = [
  {label:'Abner',value:'Abner'},
  {label:'Luiz',value:'Luiz Paulo'},
  {label:'Isabella',value:'Isabella'}
]

export default function App() {
  const[alunoSelecionado,setAlunoSelecionado]=useState('')
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

    })()//Função assincrona auto executável
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
        <Text>Rua:{street}</Text>
        <Text>Cidade:{city}</Text>
        <Text>Estado:{region}</Text>
        <Text>CEP:{postalCode}</Text>
        <Text>País:{country}</Text>
      </View>
    )
  }

  
  return (
    
    <View style={styles.container}>
      <Text>Sua localização</Text>
      {location?(
        <>
          <Text>Latitude:{location.latitude}</Text>
          <Text>Longitude:{location.longitude}</Text>

          <MapView
            style={{width:'100%',height:400}}
            initialRegion={{
              latitude:location.latitude,
              longitude:location.longitude,
              latitudeDelta:0.01,//zoom vertical
              longitudeDelta:0.01//zom horizontal
            }}
          >
             <Marker 
              coordinate={{
                latitude:location.latitude,
                longitude:location.longitude
              }}
              title='Você está aqui'
            />

          </MapView>
          {renderAddress()}
          <RNPickerSelect 
            items={nomeAlunos}
            onValueChange={(value)=>setAlunoSelecionado(value)}
            placeholder={{label:'Selecione o aluno',value:null}}
          />
          {alunoSelecionado?(
            <Text>Aluno selecionado foi:{alunoSelecionado}</Text>
          ):null}
        </>
      ):(
        <Text>Carregando endereço...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop:40
  },
});
