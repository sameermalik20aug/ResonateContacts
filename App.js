import React from 'react';

function ContactCard({ contact, onClick }) {
  const isValidContact = contact && contact.name && contact.email && contact.phone && contact.company?.name;
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:border-orange-500 transition transform hover:-translate-y-1 cursor-pointer animate-fade-in"
      onClick={() => isValidContact ? onClick(contact) : null}
    >
      <h3 className="text-lg font-semibold text-navy">
        {isValidContact ? contact.name : 'Unknown Contact'}
      </h3>
      <p className="text-gray-600">Email: {isValidContact ? contact.email : 'N/A'}</p>
      <p className="text-gray-600">Phone: {isValidContact ? contact.phone : 'N/A'}</p>
      <p className="text-gray-500 text-sm">Company: {isValidContact ? contact.company.name : 'N/A'}</p>
    </div>
  );
}

function ContactModal({ contact, onClose }) {
  if (!contact) return null;
  const isValidContact = contact.name && contact.email && contact.phone && contact.company?.name;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-navy mb-4">
          {isValidContact ? contact.name : 'Unknown Contact'}
        </h2>
        <p className="text-gray-600">Email: {isValidContact ? contact.email : 'N/A'}</p>
        <p className="text-gray-600">Phone: {isValidContact ? contact.phone : 'N/A'}</p>
        <p className="text-gray-600">Company: {isValidContact ? contact.company?.name : 'N/A'}</p>
        <p className="text-gray-600">
          Address: {contact.address ? `${contact.address.street}, ${contact.address.city}, ${contact.address.zipcode}` : 'N/A'}
        </p>
        <p className="text-gray-600">Website: {contact.website || 'N/A'}</p>
        <button
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 hover:scale-105 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function App() {
  const [contacts, setContacts] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [exportMessage, setExportMessage] = React.useState(null);

  const fetchContacts = () => {
    setLoading(true);
    setError(null);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) throw new Error('Network error, please try again!');
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Received empty or invalid contact data.');
        }
        const validContacts = data.filter(contact =>
          contact.id && contact.name && contact.email && contact.phone && contact.company?.name
        );
        if (validContacts.length === 0) {
          throw new Error('No valid contacts found.');
        }
        setContacts(validContacts);
        setFilteredContacts(validContacts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchContacts();
  }, []);

  React.useEffect(() => {
    let result = [...contacts];
    if (search) {
      const cleanSearch = search.trim().toLowerCase();
      result = result.filter(contact =>
        contact.name.toLowerCase().includes(cleanSearch) ||
        contact.email.toLowerCase().includes(cleanSearch)
      );
    }
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setFilteredContacts(result);
  }, [search, sortOrder, contacts]);

  const exportContacts = () => {
    try {
      if (contacts.length === 0) {
        setExportMessage('No contacts to export!');
        setTimeout(() => setExportMessage(null), 3000);
        return;
      }
      const json = JSON.stringify(contacts, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.json';
      a.click();
      URL.revokeObjectURL(url);
      setExportMessage('Contacts exported successfully!');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err) {
      setExportMessage('Failed to export contacts.');
      setTimeout(() => setExportMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-600 font-inter">Loading your contacts...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-600 font-inter">
        <p>Error: {error}</p>
        <button
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 hover:scale-105 transition"
          onClick={fetchContacts}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-lightgray min-h-screen">
      <header className="w-full bg-navy text-white p-6 text-center">
        <h1 className="text-3xl font-bold font-inter">Contacts App</h1>
        <p className="mt-2 font-inter">Built for Resonate to make browsing contacts seamless and intuitive!</p>
      </header>
      <div className="w-full p-6">
        {exportMessage && (
          <div className={`text-center mb-4 font-inter ${exportMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {exportMessage}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="p-2 border rounded-lg flex-1 font-inter"
            value={search}
            onChange={e => setSearch(e.target.value.trim())}
          />
          <select
            className="p-2 border rounded-lg font-inter"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort A–Z</option>
            <option value="desc">Sort Z–A</option>
          </select>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 hover:scale-105 transition font-inter"
            onClick={exportContacts}
          >
            Export
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 font-inter mb-4">
          Showing {filteredContacts.length} contacts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={setSelectedContact}
            />
          ))}
        </div>
      </div>
      <footer className="w-full bg-lightgray text-navy text-center p-4 font-inter text-sm">
        Made by Sameer Malik
      </footer>
      <ContactModal contact={selectedContact} onClose={() => setSelectedContact(null)} />
    </div>
  );
}

export default App;