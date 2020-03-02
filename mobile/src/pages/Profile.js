import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

function Profile({ navigation }) {
    const linkedinUsername = navigation.getParam('linkedin_username');
    
    return <WebView style={{ flex: 1 }} source={{ uri: `https://www.linkedin.com/in/${linkedinUsername}` }}/>
}

export default Profile;