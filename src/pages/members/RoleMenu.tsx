import { Button, Icon, Popover, PopoverLabel } from '../../components/ui'
import { roleDescription, roleLabel } from '../../lib/permissions'
import type { SpaceRole } from '../../types/workspace'

const roles: SpaceRole[] = ['owner', 'editor', 'viewer']

/** Menu chọn vai trò; mỗi lựa chọn có mô tả quyền. `blocked` khoá một vai trò kèm lý do. */
export function RoleMenu({ name, value, onPick, blocked }: { name: string; value: SpaceRole; onPick: (r: SpaceRole) => void; blocked?: Partial<Record<SpaceRole, string>> }) {
  return (
    <Popover
      label={`Vai trò của ${name}`}
      align="left"
      panelClassName="w-80"
      trigger={(p) => (
        <Button {...p} variant="tonal" shape="pill" size="sm" iconRight="expand_more" aria-label={`Vai trò của ${name}: ${roleLabel[value]}`}>
          {roleLabel[value]}
        </Button>
      )}
    >
      <PopoverLabel className="pt-1">Chọn vai trò</PopoverLabel>
      <div role="radiogroup" aria-label={`Vai trò của ${name}`} className="space-y-0.5">
        {roles.map((r) => {
          const reason = blocked?.[r]
          const checked = r === value
          return (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={!!reason}
              data-popover-close={checked || reason ? undefined : ''}
              onClick={() => !checked && !reason && onPick(r)}
              className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name={checked ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} className={checked ? 'mt-0.5 text-brand' : 'mt-0.5 text-text-secondary'} />
              <span className="min-w-0 flex-1">
                <span className="block font-body-medium text-body-medium text-text-primary">{roleLabel[r]}</span>
                <span className="block font-caption text-caption text-text-secondary">{reason ?? roleDescription[r]}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Popover>
  )
}
