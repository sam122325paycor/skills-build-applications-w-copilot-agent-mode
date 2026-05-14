import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataResourcePage from './DataResourcePage';

const columns = [
  { key: 'activity_type', label: 'Activity' },
  { key: 'user_name', label: 'User' },
];

describe('DataResourcePage', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          activity_type: 'Running',
          user_name: 'Alex Runner',
          hidden_note: 'secret-match',
        },
      ],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('search only matches visible columns', async () => {
    render(<DataResourcePage title="Activities" resourcePath="activities" columns={columns} />);

    expect(await screen.findByText('Running')).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/search records/i), 'secret-match');

    await waitFor(() => {
      expect(screen.queryByText('Running')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/no records found/i)).toBeInTheDocument();
  });

  test('details dialog closes on escape and restores focus', async () => {
    render(<DataResourcePage title="Activities" resourcePath="activities" columns={columns} />);

    const detailsButton = await screen.findByRole('button', { name: /details/i });
    await userEvent.click(detailsButton);

    const dialog = await screen.findByRole('dialog', { name: /activities record details/i });
    expect(dialog).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    expect(closeButtons[0]).toHaveFocus();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /activities record details/i })).not.toBeInTheDocument();
    });
    expect(detailsButton).toHaveFocus();
  });

  test('uses explicit endpoint when provided', async () => {
    render(
      <DataResourcePage
        title="Activities"
        resourcePath="activities"
        endpoint="https://demo-8000.app.github.dev/api/activities/"
        columns={columns}
      />
    );

    await screen.findByText('Running');

    expect(global.fetch).toHaveBeenCalledWith('https://demo-8000.app.github.dev/api/activities/');
  });
});
