import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import Navbar from '../Navbar';
import userReducer from '../../utils/userSlice';
import feedReducer from '../../utils/feedSlice';


jest.mock('axios');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const createMockStore = (userState = null) => {
  return configureStore({
    reducer: {
      user: userReducer,
      feed: feedReducer,
    },
    preloadedState: {
      user: userState,
    },
  });
};

const renderWithProviders = (component, store) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the logo/brand name', () => {
    const store = createMockStore();
    renderWithProviders(<Navbar />, store);
    
    const logo = screen.getByRole('link', { name: /CodeMatch/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });

  test('does not show user info when user is not logged in', () => {
    const store = createMockStore(null);
    renderWithProviders(<Navbar />, store);
    
    expect(screen.getByText(/CodeMatch/i)).toBeInTheDocument();
    
    expect(screen.queryByText(/Welcome/i)).not.toBeInTheDocument();
    expect(screen.queryByAltText('User Photo')).not.toBeInTheDocument();
  });

  test('shows welcome message with user first name when logged in', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      photoUrl: 'https://example.com/photo.jpg',
      email: 'john@example.com',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const welcomeMessage = screen.getByText(/Welcome, John!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('shows user avatar when logged in', () => {
    const mockUser = {
      firstName: 'Jane',
      lastName: 'Smith',
      photoUrl: 'https://example.com/jane.jpg',
      email: 'jane@example.com',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const avatar = screen.getByRole('img', { name: 'User Photo' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockUser.photoUrl);
  });

  test('displays dropdown menu items when user is logged in', () => {
    const mockUser = {
      firstName: 'Alice',
      photoUrl: 'https://example.com/alice.jpg',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    const mockUser = {
      firstName: 'Bob',
      photoUrl: 'https://example.com/bob.jpg',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const profileLink = screen.getByRole('link', { name: /Profile/i });
    const connectionsLink = screen.getByRole('link', { name: /Connections/i });
    const requestsLink = screen.getByRole('link', { name: /Requests/i });
    
    expect(profileLink).toHaveAttribute('href', '/profile');
    expect(connectionsLink).toHaveAttribute('href', '/connections');
    expect(requestsLink).toHaveAttribute('href', '/requests');
  });

  test('calls logout API and navigates to login on logout button click', async () => {
    const mockUser = {
      firstName: 'Charlie',
      photoUrl: 'https://example.com/charlie.jpg',
    };
    
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/logout'),
        {},
        { withCredentials: true }
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('handles logout error gracefully', async () => {
    const mockUser = {
      firstName: 'David',
      photoUrl: 'https://example.com/david.jpg',
    };
    
    const consoleLogSpy = jest.spyOn(console, 'log');
    axios.post.mockRejectedValueOnce(new Error('Logout failed'));
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  test('profile dropdown button is accessible when logged in', () => {
    const mockUser = {
      firstName: 'Frank',
      photoUrl: 'https://example.com/frank.jpg',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    const avatarButton = screen.getAllByRole('button')[0]; // First button is the avatar dropdown
    expect(avatarButton).toBeInTheDocument();
    expect(avatarButton).toHaveClass('btn-ghost', 'btn-circle', 'avatar');
  });

  test('displays badges on menu items', () => {
    const mockUser = {
      firstName: 'Eve',
      photoUrl: 'https://example.com/eve.jpg',
    };
    
    const store = createMockStore(mockUser);
    renderWithProviders(<Navbar />, store);
    
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('💗')).toBeInTheDocument();
    expect(screen.getByText('👁️')).toBeInTheDocument();
  });

  test('navbar has fixed positioning classes', () => {
    const store = createMockStore();
    const { container } = renderWithProviders(<Navbar />, store);
    
    const navbar = container.querySelector('.fixed');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass('fixed', 'top-0', 'left-0', 'w-full');
  });
});
