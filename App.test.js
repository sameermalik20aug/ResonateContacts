import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Contacts App', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Loading your contacts.../i)).toBeInTheDocument();
  });

  test('displays contacts after fetching', async () => {
    const mockContacts = [
      { id: 1, name: 'Leanne Graham', email: 'sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' }, address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' }, website: 'hildegard.org' }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockContacts));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
      expect(screen.getByText(/sincere@april.biz/i)).toBeInTheDocument();
    });
  });

  test('shows error message on fetch failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error, please try again!'));
    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Error: Network error, please try again!/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });

  test('filters contacts by search', async () => {
    const mockContacts = [
      { id: 1, name: 'Leanne Graham', email: 'sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' }, address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' }, website: 'hildegard.org' },
      { id: 2, name: 'Ervin Howell', email: 'shanna@melissa.tv', phone: '010-692-6593', company: { name: 'Deckow-Crist' }, address: { street: 'Victor Plains', city: 'Wisokyburgh', zipcode: '90566-7771' }, website: 'anastasia.net' }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockContacts));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
      expect(screen.getByText(/Ervin Howell/i)).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText(/Search by name or email.../i);
    fireEvent.change(searchInput, { target: { value: 'Leanne' } });
    expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ervin Howell/i)).not.toBeInTheDocument();
  });

  test('sorts contacts A–Z and Z–A', async () => {
    const mockContacts = [
      { id: 1, name: 'Leanne Graham', email: 'sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' }, address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' }, website: 'hildegard.org' },
      { id: 2, name: 'Ervin Howell', email: 'shanna@melissa.tv', phone: '010-692-6593', company: { name: 'Deckow-Crist' }, address: { street: 'Victor Plains', city: 'Wisokyburgh', zipcode: '90566-7771' }, website: 'anastasia.net' }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockContacts));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
      expect(screen.getByText(/Ervin Howell/i)).toBeInTheDocument();
      const contactCards = screen.getAllByRole('heading', { level: 3 }); // h3 in ContactCard
      expect(contactCards[0]).toHaveTextContent(/Ervin Howell/i); // A–Z: Ervin first
      expect(contactCards[1]).toHaveTextContent(/Leanne Graham/i);
    });
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'desc' } });
    await waitFor(() => {
      const contactCards = screen.getAllByRole('heading', { level: 3 });
      expect(contactCards[0]).toHaveTextContent(/Leanne Graham/i); // Z–A: Leanne first
      expect(contactCards[1]).toHaveTextContent(/Ervin Howell/i);
    });
  });

  test('opens modal with contact details', async () => {
    const mockContacts = [
      { id: 1, name: 'Leanne Graham', email: 'sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' }, address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' }, website: 'hildegard.org' }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockContacts));
    render(<App />);
    await waitFor(() => screen.getByText(/Leanne Graham/i));
    fireEvent.click(screen.getByText(/Leanne Graham/i));
    expect(screen.getByText(/Address: Kulas Light, Gwenborough, 92998-3874/i)).toBeInTheDocument();
    expect(screen.getByText(/Website: hildegard.org/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByText(/Address: Kulas Light, Gwenborough, 92998-3874/i)).not.toBeInTheDocument();
  });

  test('export button triggers download', async () => {
    const mockContacts = [
      { id: 1, name: 'Leanne Graham', email: 'sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' }, address: { street: 'Kulas Light', city: 'Gwenborough', zipcode: '92998-3874' }, website: 'hildegard.org' }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockContacts));
    render(<App />);
    await waitFor(() => screen.getByText(/Leanne Graham/i));
    // Mock document.createElement
    const createElementSpy = jest.spyOn(document, 'createElement');
    const clickSpy = jest.fn();
    const mockLink = {
      href: '',
      download: '',
      click: clickSpy,
      nodeType: 1, // Element node
      tagName: 'A',
      setAttribute: jest.fn(),
      remove: jest.fn()
    };
    createElementSpy.mockReturnValueOnce(mockLink);
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:test');
    global.URL.revokeObjectURL = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: /Export/i }));
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
    expect(screen.getByText(/Contacts exported successfully!/i)).toBeInTheDocument();
    createElementSpy.mockRestore();
    // Clean up global mocks
    delete global.URL.createObjectURL;
    delete global.URL.revokeObjectURL;
  });
});