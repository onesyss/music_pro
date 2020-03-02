import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewMusic } from '../services/socket';


function Main({ navigation }) {
    const [musics, setMusics] =useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [categoria, setCategoria] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
           const{ granted } = await requestPermissionsAsync();

           if (granted) {
               const { coords } = await getCurrentPositionAsync({
                   enableHighAccuracy: true,
               });

               const { latitude, longitude } = coords;

               setCurrentRegion({
                   latitude,
                   longitude,
                   latitudeDelta: 0.04,
                   longitudeDelta: 0.04,
               })
           }
        }

        loadInitialPosition();
    }, []);

    useEffect(() => {
        subscribeToNewMusic(music => setMusic([...music, music]));
    }, [music]);

    function setupWebsocket () {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            categoria,
        );
        
    }

    async function loadMusics() {
        const { latitude, longitude } = currentRegion;
        
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,  
                categoria
            }
        });

        setMusics(response.data.musics);
        setupWebsocket();
    }

    function handleRegionChanged(region) {
        console.log(region);
        setCurrentRegion(region);

    }


    if (!currentRegion) {
        return null;
    }

    return (
      <>
        <MapView 
        onRegionChangeComplete={handleRegionChanged} 
        initialRegion={currentRegion} 
        style={styles.map}
        >
         {musics.map(music => (
               <Marker 
                 key={music._id}
                 coordinate={{
                   latitude: music.location.coordinates[1], 
                   longitude: music.location.coordinates[0],
                   }}
                   >
                <Image 
                 style={styles.avatar} 
                 source={{ uri: music.avatar_url }}
                />
               
                <Callout onPress={() => {
                    navigation.navigate('Profile', { linkedin_username: music.linkedin_username });
                }}>
                  <View style={styles.callout}>
                      <Text style={styles.musicName}>{music.name}</Text>
                      <Text style={styles.musicBio}>{music.bio}</Text>
                      <Text style={styles.musicCategoria}>{music.categoria.join(', ')}</Text>
                  </View>
                </Callout>
               </Marker>
         ))}
      </MapView>
        <View style={styles.searchForm}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar prof por instrum..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}    
            value={categoria}
            onChangeText= {setCategoria}  
          />

          <TouchableOpacity onPress={loadMusic} style={styles.loadButton}>
              <MaterialIcons name="my-location" size={20} color="#FFF"/>
          </TouchableOpacity>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54, 
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },

    callout: {
        width: 260,
    },

    musicName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    musicBio: {
        color: '#666',
        marginTop: 5,
    },

    musicCategoria: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor:'#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#FF4500',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }
})

export default Main;