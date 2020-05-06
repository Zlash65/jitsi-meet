/* @flow */

import React from 'react';
import { FieldTextStateless as TextField } from '@atlaskit/field-text';

import { Dialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';

import AbstractDisplayNamePrompt, {
    type Props
} from '../AbstractDisplayNamePrompt';

/**
 * The type of the React {@code Component} props of {@link DisplayNamePrompt}.
 */
type State = {

    /**
     * The name to show in the display name text field.
     */
    displayName: string,

    /**
     * The info to show in the email /mobile number text field.
     */
    emailMobile: string
};

/**
 * Implements a React {@code Component} for displaying a dialog with an field
 * for setting the local participant's display name.
 *
 * @extends Component
 */
class DisplayNamePrompt extends AbstractDisplayNamePrompt<State> {
    /**
     * Initializes a new {@code DisplayNamePrompt} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        const { getState } = APP.store;
        this.state = {
            displayName: getState()['features/base/settings'].displayName,
            emailMobile: getState()['features/base/settings'].email
        };

        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onEmailMobileChange = this._onEmailMobileChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     *
     * Disable outside click to force enter DisplayName
     *
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Dialog
                isModal = { true }
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.displayNameRequired'
                width = 'small'>
                <TextField
                    autoFocus = { !this.state.displayName ? true : false }
                    compact = { true }
                    label = { this.props.t('dialog.enterDisplayName') }
                    name = 'displayName'
                    onChange = { this._onDisplayNameChange }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.displayName } />
                <TextField
                    autoFocus = { (this.state.displayName || !this.state.emailMobile) ? true : false }
                    compact = { true }
                    label = { this.props.t('dialog.enterEmailMobile') }
                    name = 'emailMobile'
                    onChange = { this._onEmailMobileChange }
                    shouldFitContainer = { true }
                    type = 'text'
                    value = { this.state.emailMobile } />
            </Dialog>);
    }

    _onDisplayNameChange: (Object) => void;

    _onEmailMobileChange: (Object) => void;

    /**
     * Updates the entered display name.
     *
     * @param {Object} event - The DOM event triggered from the entered display
     * name value having changed.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(event) {
        this.setState({
            displayName: event.target.value
        });
    }

    /**
     * Updates the entered email / mobile number.
     *
     * @param {Object} event - The DOM event triggered from the entered email /
     * mobile number value having changed.
     * @private
     * @returns {void}
     */
    _onEmailMobileChange(event) {
        this.setState({
            emailMobile: event.target.value
        });
    }

    _onSetDisplayName: (string, string) => boolean;

    _onSubmit: () => boolean;

    /**
     * Dispatches an action to update the local participant's display name. A
     * name must be entered for the action to dispatch.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit() {
        return this._onSetDisplayName(this.state.displayName, this.state.emailMobile);
    }
}

export default translate(connect()(DisplayNamePrompt));
