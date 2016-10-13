import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { changeEntityOfTerminalTicket, getEntityScreenItems } from '../../queries';
import * as Actions from '../../actions';

class EntityListButton extends React.Component {

    render() {
        const style = {
            'display': 'flex',
            'flex':'1',
            'height':'75px'
        };
        const style2 = {
            'color': this.props.labelColor,
            'flex':'1',
            'position':'absolute',
            'top':'0',
            'left':'0',
            'height':'100%',
            'width':'100%'
        };
        
        return (<RaisedButton
            style={style}
            className='entityButton flexButton'
            backgroundColor={this.props.backgroundColor}
            onClick={this.props.onClick}>
            <div style={style2}>
                <ReactMarkdown source={this.props.caption} />
            </div>
        </RaisedButton>)
    }
}

class EntityList extends React.Component {

    loadItems(name) {
        this.props.loadEntityScreenRequest(name);
        getEntityScreenItems(name, (items) => {
            this.props.loadEntityScreenSuccess(name, items);
        })
    }

    componentDidMount() {
        this.loadItems(this.props.location.query.screenName);
    }

    render() {
        if (!this.props.items) {
            return <p>Loading...</p>
        }

        return (
            <div className="entityList">
                {this.props.items.map(x =>
                    <EntityListButton
                        key={x.name}
                        caption={x.caption}
                        labelColor={x.labelColor}
                        backgroundColor={x.color}
                        onClick={(e) => this.selectEntity(x.name)}
                        />
                )}
            </div>
        );
    }

    selectEntity = (entityName) => {
        changeEntityOfTerminalTicket(this.props.location.query.terminalId, 'Tables', entityName, () => {
            this.context.router.push('/');
        });
    }
}

EntityList.contextTypes = {
    router: React.PropTypes.object
}

const mapStateToProps = state => ({
    name: state.entityList.get('name'),
    isFetching: state.entityList.get('isFetching'),
    items: state.entityList.get('items')
})

const mapDispatchToProps = ({
    loadEntityScreenRequest: Actions.loadEntityScreenRequest,
    loadEntityScreenSuccess: Actions.loadEntityScreenSuccess
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntityList)