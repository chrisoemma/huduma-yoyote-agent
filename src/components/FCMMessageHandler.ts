import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSelector, RootStateOrAny } from 'react-redux';
import { changeNidaStatus, logoutOtherDevice, setUserChanges, updateAgentChanges } from '../features/auth/userSlice';
import { useAppDispatch } from '../app/store';
import { changeDocStatus } from '../features/account/AccountSlice';
import { addNotification } from '../features/Notifications/NotificationAgentSlice';


const FCMMessageHandler = () => {
  const { user } = useSelector((state: RootStateOrAny) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    // Handle messages when the app is in the background or terminated
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const handleRemoteMessage = remoteMessage => {
    
    const { data,notification } = remoteMessage;

    if (data && data.type) {
      const type = data.type;
      if(data?.notification_type){
        const notificationData = {
          id: data.id,
          type: data.notification_type,
          title: data.title,
          message: data.message,
          viewed: false,
        };
        dispatch(addNotification(notificationData));
      }

      switch (type) {
        case 'account_changed':
          const userChanges = data.userChanges ? JSON.parse(data.userChanges) : {};
          const agentChanges = data.agentChanges ? JSON.parse(data.agentChanges) : {};
          dispatch(setUserChanges(userChanges));
          dispatch(updateAgentChanges(agentChanges))
          break;
          case 'logout_device':
            dispatch(logoutOtherDevice());
            break;
          case 'nida_status_chaged':
            dispatch(changeNidaStatus(data.nidaStatus))
            break;
          case 'doc_status':
            dispatch(changeDocStatus({ docId:data.docId, docStatus:data.docStatus }));
          break
        default:
          // Handle other types or default case
          break;
      }
    }
  };

  return null;
};

export default FCMMessageHandler;
