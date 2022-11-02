/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect, memo } from 'react';
import { useIntl } from 'react-intl';
import pluginId from '../../pluginId';
import { Box, Button, Flex, LinkButton } from '@strapi/design-system';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { Typography } from '@strapi/design-system/Typography';
import { GridLayout } from '@strapi/design-system/Layout';
import { TextInput } from '@strapi/design-system/TextInput';
import { Write, Lock, Plus } from '@strapi/icons';
import axiosInstance from "../../utils/axiosInstance";
import { getTrad } from '../../utils';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const [creds, setCreds] = useState({
    app_id: "",
    app_secret: ""
  });
  const [saving, setSaving] = useState(false);
  const [editable, setEditable] = useState(true);

  function handleAppID(app_id) {
    setCreds({
      app_id: app_id,
      app_secret: creds.app_secret,
    })
  }

  function handleAppSecret(app_secret) {
    setCreds({
      app_id: creds.app_id,
      app_secret: app_secret,
    })
  }

  async function fetchData() {
    try {
      const { data } = await axiosInstance.get(`/${pluginId}/credentials`);
      setCreds({
        app_id: data.app_id ? data.app_id : "",
        app_secret: data.app_secret ? data.app_secret : "",
      })
      if (data) {
        if (data.app_id && data.app_secret) {
          setEditable(false);
        } else {
          setEditable(true);
        }
      } else {
        setEditable(true);
      }
    } catch (error) {
      console.log(error);
      setCreds({
        app_id: "",
        app_secret: ""
      })
      setEditable(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      await axiosInstance.post(`/${pluginId}/credentials/add`, {
        app_id: creds.app_id,
        app_secret: creds.app_secret,
      })
      await fetchData();
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  }
  function handleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    setEditable(true);
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <div>
      <Box padding={8} background="primary100">
        <BaseHeaderLayout
          primaryAction={<LinkButton startIcon={<Plus />} size="L" variant="default" href="https://mp.weixin.qq.com/cgi-bin/wx">

            {formatMessage({
              id: getTrad('Header.create.msg'),
              defaultMessage: 'Create WeChat Mini Program',
            })}
          </LinkButton>}
          title={formatMessage({
            id: getTrad('Header.title'),
            defaultMessage: 'WeChat Mini Program Authenticator',
          })} subtitle="By wfzong." as="h2" />
      </Box>

      <Box padding={8} background="neutral100">
        <Box padding={4}>
          <Typography variant="beta">{formatMessage({
            id: getTrad('Form.title'),
            defaultMessage: 'Add/Update your WeChat Mini Program Details.',
          })}</Typography>
        </Box>
        <GridLayout>
          <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
            <TextInput
              required
              disabled={!editable}
              placeholder={formatMessage({
                id: getTrad('Form.input.appid.placeholder'),
                defaultMessage: 'Please input your AppID',
              })}
              label={formatMessage({
                id: getTrad('Form.input.appid.label'),
                defaultMessage: 'WeChat Mini Program AppID',
              })}
              name="AppID"
              onChange={e => handleAppID(e.target.value)}
              value={creds.app_id} />
          </Box>
          <Box padding={4} hasRadius background="neutral0" shadow="tableShadow">
            <TextInput
              required
              type="password"
              disabled={!editable}
              placeholder={formatMessage({
                id: getTrad('Form.input.app_secret.placeholder'),
                defaultMessage: 'Please input your AppSecret',
              })}
              label={formatMessage({
                id: getTrad('Form.input.app_secret.label'),
                defaultMessage: 'WeChat Mini Program AppSecret',
              })}
              name="AppSecret"
              hint={formatMessage({
                id: getTrad('Form.input.app_secret.hint'),
                defaultMessage: 'Available in your Mini Program project dev panel',
              })}
              onChange={e => handleAppSecret(e.target.value)}
              value={creds.app_secret}
            />
          </Box>
        </GridLayout>
        <Flex marginTop={4} justifyContent="space-between">
          <Button
            disabled={editable}
            onClick={handleEdit}
            size="L"
            endIcon={<Write />}
            variant='secondary'
          >{formatMessage({
            id: getTrad('edit.msg'),
            defaultMessage: 'Edit',
          })}</Button>
          <Button
            disabled={!editable}
            loading={saving}
            onClick={handleSubmit}
            size="L"
            endIcon={<Lock />}
            variant='default'
          >{formatMessage({
            id: getTrad('save.msg'),
            defaultMessage: 'Save Credentials',
          })}</Button>
        </Flex>
      </Box>
    </div>
  );
};

export default memo(HomePage);