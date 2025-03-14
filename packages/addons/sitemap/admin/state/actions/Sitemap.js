/**
 *
 *
 * ConfigPage actions
 *
 */

import { Map } from 'immutable';

import {
  SUBMIT_MODAL,
  ON_CHANGE_CONTENT_TYPES,
  ON_CHANGE_SETTINGS,
  GET_SETTINGS_SUCCEEDED,
  GET_CONTENT_TYPES_SUCCEEDED,
  GET_LANGUAGES_SUCCEEDED,
  ON_SUBMIT_SUCCEEDED,
  DELETE_CONTENT_TYPE,
  DELETE_CUSTOM_ENTRY,
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  UPDATE_SETTINGS,
  GET_SITEMAP_INFO_SUCCEEDED,
  ON_CHANGE_CUSTOM_ENTRY,
  GET_ALLOWED_FIELDS_SUCCEEDED,
  SET_LOADING_STATE,
} from '../../config/constants';

import getTrad from '../../helpers/getTrad';


// Get initial settings
export function getSettings(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const res = await get('/webtools-addon-sitemap/settings/');
      const settings = res.data;
      dispatch(getSettingsSucceeded(Map(settings)));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getSettingsSucceeded(settings) {
  return {
    type: GET_SETTINGS_SUCCEEDED,
    settings,
  };
}

export function onChangeContentTypes(contentType, lang, key, value) {
  return {
    type: ON_CHANGE_CONTENT_TYPES,
    contentType,
    lang,
    key,
    value,
  };
}

export function onChangeCustomEntry(url, key, value) {
  return {
    type: ON_CHANGE_CUSTOM_ENTRY,
    url,
    key,
    value,
  };
}

export function onChangeSettings(key, value) {
  return {
    type: ON_CHANGE_SETTINGS,
    key,
    value,
  };
}

export function discardAllChanges() {
  return {
    type: DISCARD_ALL_CHANGES,
  };
}

export function updateSettings(settings) {
  return {
    type: UPDATE_SETTINGS,
    settings,
  };
}

export function discardModifiedContentTypes() {
  return {
    type: DISCARD_MODIFIED_CONTENT_TYPES,
  };
}

export function generateSitemap(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      dispatch(setLoading(true));
      const res = await get('/webtools-addon-sitemap');
      const message = res.data.message;
      dispatch(getSitemapInfo(toggleNotification, formatMessage, get));
      toggleNotification({ type: 'success', message });
      dispatch(setLoading(false));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getContentTypes(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const res = await get('/webtools/info/getContentTypes');
      const contentTypes = res.data;
      dispatch(getContentTypesSucceeded(contentTypes));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getContentTypesSucceeded(contentTypes) {
  return {
    type: GET_CONTENT_TYPES_SUCCEEDED,
    contentTypes,
  };
}

export function getLanguages(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const res = await get('/webtools/info/getLanguages');
      const languages = res.data;
      dispatch(getLanguagesSucceeded(languages));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getLanguagesSucceeded(languages) {
  return {
    type: GET_LANGUAGES_SUCCEEDED,
    languages,
  };
}

export function submit(settings, toggleNotification, formatMessage, put) {
  return async function(dispatch) {
    try {
      await put('/webtools-addon-sitemap/settings/', settings);
      dispatch(onSubmitSucceeded());
      toggleNotification({ type: 'success', message: formatMessage({ id: getTrad('notification.success.submit') }) });
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function onSubmitSucceeded() {
  return {
    type: ON_SUBMIT_SUCCEEDED,
  };
}

export function submitModal() {
  return {
    type: SUBMIT_MODAL,
  };
}

export function deleteContentType(key, lang) {
  return {
    type: DELETE_CONTENT_TYPE,
    key,
    lang,
  };
}

export function deleteCustomEntry(key) {
  return {
    type: DELETE_CUSTOM_ENTRY,
    key,
  };
}

export function getSitemapInfo(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const res = await get('/webtools-addon-sitemap/info');
      const info = res.data;
      dispatch(getSitemapInfoSucceeded(info));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getSitemapInfoSucceeded(info) {
  return {
    type: GET_SITEMAP_INFO_SUCCEEDED,
    info,
  };
}

export function getAllowedFields(toggleNotification, formatMessage, get) {
  return async function(dispatch) {
    try {
      const res = await get('/webtools-addon-sitemap/pattern/allowed-fields/');
      const fields = res.data;
      dispatch(getAllowedFieldsSucceeded(fields));
    } catch (err) {
      toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
    }
  };
}

export function getAllowedFieldsSucceeded(fields) {
  return {
    type: GET_ALLOWED_FIELDS_SUCCEEDED,
    fields,
  };
}

export function setLoading(loading) {
  return {
    type: SET_LOADING_STATE,
    loading,
  };
}
