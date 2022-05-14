import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import * as S from './style';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import * as T from 'typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState<boolean>(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<T.IUser | false>('/api/users', fetcher, { dedupingInterval: 2000 });
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false);
    });
  }, []);
  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);
  const onClickUserProfile = useCallback((e) => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      if (!newWorkspace) return;
      axios
        .post('/api/workspaces', { workspace: newWorkspace, url: newUrl }, { withCredentials: true })
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <S.Header>
        <S.RightMenu>
          <span onClick={onClickUserProfile}>
            <S.ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <S.ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </S.ProfileModal>
                <S.LogOutButton onClick={onLogout}>로그아웃</S.LogOutButton>
              </Menu>
            )}
          </span>
        </S.RightMenu>
      </S.Header>
      <S.WorkspaceWrapper>
        <S.Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <S.WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</S.WorkspaceButton>
              </Link>
            );
          })}
          <S.AddButton onClick={onClickCreateWorkspace}>+</S.AddButton>
        </S.Workspaces>
        <S.Channels>
          <S.WorkspaceName>Sleact</S.WorkspaceName>
          <S.MenuScroll>MenuScroll</S.MenuScroll>
        </S.Channels>
        <S.Chats>{children}</S.Chats>
      </S.WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit"> 생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
