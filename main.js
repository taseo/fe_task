const app = (function () {
    const elements = {};
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    function formatDateString(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', dateOptions);
    }

    function createNode(nodeConfig) {
        const node = document.createElement(nodeConfig.nodeType);

        if (nodeConfig.label) {
            node.textContent = nodeConfig.label;
        }

        if (nodeConfig.classList && nodeConfig.classList.length > 0) {

            for (const classItem of nodeConfig.classList) {
                node.classList.add(classItem);
            }
        }

        if (nodeConfig.children && nodeConfig.children.length > 0) {
            for (const childConfig of nodeConfig.children) {
                node.appendChild(createNode(childConfig));
            }
        }

        return node;
    }

    function createLaunchCard(launchInfo) {
        const launchCard = document.createElement('article');
        const launchDetails = document.createElement('ul');

        launchCard.classList.add('card');

        launchCard.appendChild(createNode({
            nodeType: 'h2',
            label: '🚀 ' + launchInfo.name
        }));

        if (launchInfo.mission) {
            launchCard.appendChild(createNode({
                nodeType: 'p',
                label: launchInfo.mission.description
            }));

            launchDetails.appendChild(createNode({
                nodeType: 'li',
                children: [
                    {
                        nodeType: 'span',
                        label: 'Orbit: ',
                        classList: ['fw-700']
                    },
                    {
                        nodeType: 'span',
                        label: launchInfo.mission.orbit_abbrev
                    }
                ]
            }));
        }

        if (launchInfo.launch_service_provider) {
            launchDetails.appendChild(createNode({
                nodeType: 'li',
                children: [
                    {
                        nodeType: 'span',
                        label: 'Provider: ',
                        classList: ['fw-700']
                    },
                    {
                        nodeType: 'span',
                        label: launchInfo.launch_service_provider.name
                    }
                ]
            }));

            launchDetails.appendChild(createNode({
                nodeType: 'li',
                children: [
                    {
                        nodeType: 'span',
                        label: 'Type: ',
                        classList: ['fw-700']
                    },
                    {
                        nodeType: 'span',
                        label: launchInfo.launch_service_provider.type
                    }
                ]
            }));
        }

        launchDetails.appendChild(createNode({
            nodeType: 'li',
            children: [
                {
                    nodeType: 'span',
                    label: 'Launch Window Start: ',
                    classList: ['fw-700']
                },
                {
                    nodeType: 'span',
                    label: formatDateString(launchInfo.window_start)
                }
            ]
        }));

        launchDetails.appendChild(createNode({
            nodeType: 'li',
            children: [
                {
                    nodeType: 'span',
                    label: 'Launch Window End: ',
                    classList: ['fw-700']
                },
                {
                    nodeType: 'span',
                    label: formatDateString(launchInfo.window_end)
                }
            ]
        }));

        launchCard.appendChild(launchDetails);

        return launchCard;
    }

    function buildList(data) {

        if (data.results && data.results.length > 0) {

            for (const launchInfo of data.results) {
                elements.main.appendChild(createLaunchCard(launchInfo));
            }
        } else {
            elements.main.appendChild(document.createElement('p').textContent = 'No further launches scheduled!');
        }
    }

    function init() {
        elements.root = document.getElementById('root');
        elements.main = document.getElementById('main');

        elements.root.classList.remove('hidden');

        fetch('https://spacelaunchnow.me/api/3.5.0/launch/upcoming/')
            .then(response => response.json())
            .then(data => buildList(data))
            .catch(error => {
                alert('Oops! Something went wrong');
                console.log(error);
            })
    }

    return {
        init
    }
})();

app.init();