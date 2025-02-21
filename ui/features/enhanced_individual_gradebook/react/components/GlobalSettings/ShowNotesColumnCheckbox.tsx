/*
 * Copyright (C) 2023 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useState} from 'react'
import {useScope as useI18nScope} from '@canvas/i18n'
import doFetchApi from '@canvas/do-fetch-api-effect'
import {teacherNotes} from '../../../types/gradebook.d'

const I18n = useI18nScope('enhanced_individual_gradebook')
type Props = {
  teacherNotes?: teacherNotes | null
  customColumnsUrl?: string | null
  customColumnUrl?: string | null
}
export default function ShowNotesColumnCheckbox({
  teacherNotes,
  customColumnsUrl,
  customColumnUrl,
}: Props) {
  const [showNotesColumn, setShowNotesColumn] = useState(
    teacherNotes?.hidden !== undefined ? !teacherNotes?.hidden : false
  )
  const handleShowNotesColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let url: string
    let method: string
    let body: {}
    if (customColumnUrl && customColumnsUrl) {
      if (teacherNotes) {
        method = 'PUT'
        url = customColumnUrl.replace(':id', teacherNotes?.id)
        body = {column: {hidden: !event.target.checked}}
      } else if (event.target.checked) {
        url = customColumnsUrl
        method = 'POST'
        body = {
          column: {
            title: I18n.t('notes', 'Notes'),
            position: 1,
            teacher_notes: true,
          },
        }
      } else {
        return
      }
    } else {
      return
    }
    doFetchApi({
      method,
      body,
      path: url,
    })
    setShowNotesColumn(event.target.checked)
  }

  return (
    <div
      className="checkbox"
      style={{padding: 12, margin: '10px 0px', background: '#eee', borderRadius: 5}}
    >
      <label className="checkbox" htmlFor="show_notes_checkbox">
        <input
          type="checkbox"
          id="show_notes_checkbox"
          name="show_notes_checkbox"
          checked={showNotesColumn}
          onChange={handleShowNotesColumnChange}
        />
        {I18n.t('Show Notes in Student Info')}
      </label>
    </div>
  )
}
